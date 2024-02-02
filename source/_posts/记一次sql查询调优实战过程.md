---
title: 记一次sql查询调优实战过程
date: 2024-02-02 16:57:18
tags: sql优化
categories:
---

在处理一个长达 500 行的大型 sql 查询文件的过程中，我发现了响应非常慢。这段 sql 是为后台报表服务的，仅仅查询一天的数据就要花费接近 20 秒的时间，那么如果是一个月的话肯定超时了。毫无疑问，这个 sql 需要优化。

首先查看执行计划。如果是执行 explain 命令来获得执行计划，得到的 cost 并不能直接看出速度的快慢。因此，需要用`explain (analyze)`。由于查询是由好几个 CTE 子表组成的，所以执行计划也是分别给出了几个 CTE 子表的花费时间。虽然很长，但是，细心的查看后，果然发现了异常：

![17068653903891706865390291.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/17068653903891706865390291.png)

可以看到，在查询 money_bag_balance 这张子表时，actutal time(实际执行时间)达到了 2295 毫秒，他就是元凶。接下来看，发现是在 trade_list_internal 这张流水表上进行全表扫描，难怪这么慢！于是，我定位到 money_bag_balance 的 sql 语句,这张表是由 income 和 balance 合并而来，以 income 为例：

```sql
money_bag_income as (
select
 COALESCE(SUM(CASE WHEN method = 'wx_pay' THEN real_fee ELSE 0 END),0) AS wechat_income,
 COALESCE(SUM(CASE WHEN method = 'ali_pay' THEN real_fee ELSE 0 END),0) AS alipay_income,
 COALESCE(SUM(CASE WHEN method = 'epay' THEN real_fee ELSE 0 END),0) AS epay_income,
 COALESCE(SUM(CASE WHEN method = 'wallet_pay' THEN real_fee ELSE 0 END),0) AS money_bag_income_real,
 COALESCE(SUM(CASE WHEN method = 'virtual_pay' THEN real_fee ELSE 0 END),0) AS money_bag_income_virtual,
 COALESCE(SUM(CASE WHEN method = 'union_pay' THEN real_fee ELSE 0 END),0) AS union_pay_income,
 COALESCE(SUM(CASE WHEN method = 'ccb_pay' THEN real_fee ELSE 0 END),0) AS ccb_pay_income,
 COALESCE(SUM(CASE WHEN method = 'ccb_pay_dc' THEN real_fee ELSE 0 END),0) AS ccb_pay_dc_income
 from trade_list_internal
 where trade_type='charge'
   and status='success'
-- 	 and commit_time between '2023-07-17' and '2023-07-18'
	and  (  (''='2024-02-01' and ''='2024-02-02') or
	(''<>'2024-02-01' and ''='2024-02-02' and commit_time>='2024-02-01' ) or
	(''='2024-02-01' and ''<>'2024-02-02' and commit_time<'2024-02-02' ) or
	(''<>'2024-02-01' and ''<>'2024-02-02' and commit_time >= '2024-02-01' and commit_time<'2024-02-02' ) )
),
```

commit_time 这个字段没加索引，所以走了全表查询。经过沟通，换了一个正确的且带索引的字段，查询在 0.2s 内完成！一下子提升了四十多倍！
