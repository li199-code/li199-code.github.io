---
title: pgsql常用且容易忘记的一些用法
author: Jason Lee
date: 2023-11-11 16:41:49
tags: pgsql
categories:
---

总结一些工作中非常有用的pgsql用法。

## 日期类

加入time列是timestamp类型的，那么

需要获得昨日的数据：`select ... where time between current_date-1 and current_date`;

过去24小时：`select ... where time > current_timestamp - interval '1 day'`;

今日的数据：`select ... where time > current_date`；

过去七天的数据并按天列出：`select ... where time > current_date-7 group by extract(day from parking_time)`；

需要注意的是，在where子句中慎用强转符号`::`，因为这会让该列索引失效，从而搜索速度变得很慢。应该变通成上面这些形式，即sql会在timestamp类型和date类型比较时自动将date类型转为timestamp类型。


