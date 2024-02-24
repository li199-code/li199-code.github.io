---
title: sql查询调优实战过程
date: 2024-02-02 16:57:18
tags: sql优化
categories:
---

## 例 1 筛选字段没加索引

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

## 例 2 在筛选字段上进行计算导致索引失效

和例 1 一样，本例也是一个营收分析的脚本。一样从执行计划开始。观察后发现，多次出现了一个过滤条件：

```
> Parallel Seq Scan on statistics_by_area_block_street a  (cost=0.00..66759.73 rows=911 width=282) (actual time=825.208..825.444 rows=120 loops=5)

Filter: (((data_owner_id)::text = ANY ('{66ebc3d0-5870-11ea-bbb2-d5c9d3c42033,8d51f590-21c7-11ec-8c04-8f0bedcb705d,95885640-cd3e-11ed-856c-93f3797cd92f,a65816d0-1489-11ee-a19d-0765044c45ed}'::text[])) AND (to_char((sta_date)::timestamp with time zone, 'yyyy-MM-dd'::text) >= '2024-02-03'::text) AND (to_char((sta_date)::timestamp with time zone, 'yyyy-MM-dd'::text) <= '2024-02-03'::text))'

Rows Removed by Filter: 172940
```

对应的 sql 片段：

```sql
where (  (''='2024-02-03' and ''='2024-02-03') or
(''<>'2024-02-03' and ''='2024-02-03' and to_char(sta_date,'yyyy-MM-dd')>='2024-02-03' ) or
(''='2024-02-03' and ''<>'2024-02-03' and to_char(sta_date,'yyyy-MM-dd')<='2024-02-03' ) or
(''<>'2024-02-03' and ''<>'2024-02-03' and to_char(sta_date,'yyyy-MM-dd') between '2024-02-03' and '2024-02-03' )
)
and a.data_owner_id in ('66ebc3d0-5870-11ea-bbb2-d5c9d3c42033','8d51f590-21c7-11ec-8c04-8f0bedcb705d','95885640-cd3e-11ed-856c-93f3797cd92f','a65816d0-1489-11ee-a19d-0765044c45ed')
```

data_owner_id 和 sta_date 两个字段，前者没有索引，后者加了索引。于是我先把 data_owner_id 加了索引，再运行，速度没有提升。看到后面，发现是 `to_char` 这个函数用在 sta_date 上导致索引失效。修改成 sta_date<'2024-02-03'后，速度从原来的 5.2s 提升到 0.6s。

## 例 3 count distinct 问题

原 sql 如下：

```sql
SELECT
	count(CASE WHEN type = 'user' THEN 1 END) "total_count",
	count(CASE WHEN "type" = 'user' AND created_at > CURRENT_DATE THEN 1 END) "today_count",
	count(CASE WHEN "type" = 'user' AND created_at > CURRENT_DATE - 7 THEN 1 END) "7days_count",
	count(CASE WHEN "type" = 'user' AND created_at > CURRENT_DATE - 30 THEN 1 END) "30days_count",
	(SELECT count(DISTINCT user_id) FROM bind_plate_no WHERE deleted = FALSE) bind_total_count -- 执行慢的部分
FROM base_user
```

![17082445872911708244586983.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/17082445872911708244586983.png)

base_user 表的数据量是百万级。从执行计划看出，耗时部分出现在 bind_plate_no 表的 aggregate 上。对应的 sql 是一个典型的 count distinct 问题。虽然 user_id 加了索引，但是在 count 内部 distinct 需要大量的额外计算，因此很慢。试过去掉 distinct 后，这句 sql 就变得很快了。但是，不能破坏原有业务逻辑啊。解决方案是先去重、再汇总。

```sql
select count(*) from (select distinct user_id FROM bind_plate_no WHERE deleted = FALSE) tmp
```

新的 sql 运行速度从 9 秒，提升到 2.5 秒。

另外，我也试了另一种解决方案，即 count group by，本质也是先去重、再汇总。结果来看，比上述方案慢了 1 秒。

参考资料：

---

SQL 优化（二） 快速计算 Distinct Count
http://www.jasongj.com/2015/03/15/count_distinct/

---
