---
title: pgsql常用且容易忘记的一些用法
author: Jason Lee
date: 2023-11-11 16:41:49
tags: pgsql
categories:
---

总结一些工作中非常有用的 pgsql 用法。

## 日期类

加入 time 列是 timestamp 类型的，那么

需要获得昨日的数据：`select ... where time between current_date-1 and current_date`;

过去 24 小时：`select ... where time > current_timestamp - interval '1 day'`;

今日的数据：`select ... where time > current_date`；

过去七天的数据并按天列出：`select ... where time > current_date-7 group by extract(day from parking_time)`；

需要注意的是，在 where 子句中慎用强转符号`::`，因为这会让该列索引失效，从而搜索速度变得很慢。应该变通成上面这些形式，即 sql 会在 timestamp 类型和 date 类型比较时自动将 date 类型转为 timestamp 类型。

在 PostgreSQL 中，可以使用不同的函数和模式来将 `timestamp` 数据类型转换为特定的时间格式。以下是几种常见的方法：

1. 使用 `TO_CHAR` 函数：`TO_CHAR(timestamp, 'format')` 函数将 `timestamp` 转换为指定的时间格式。例如，要将 `timestamp` 转换为年-月-日 小时:分钟:秒 的格式，可以使用以下代码：

   ````sql
   SELECT TO_CHAR(timestamp_column, 'YYYY-MM-DD HH24:MI:SS') FROM your_table;
   ```

   ````

2. 使用 `EXTRACT` 函数：`EXTRACT(field FROM timestamp)` 函数允许提取 `timestamp` 中的特定时间部分（如年、月、日、小时等）。然后，可以将提取的时间部分按照需要的格式进行拼接。例如，以下代码将 `timestamp` 转换为年-月-日 格式：

   ````sql
   SELECT EXTRACT(YEAR FROM timestamp_column) || '-' || EXTRACT(MONTH FROM timestamp_column) || '-' || EXTRACT(DAY FROM timestamp_column) FROM your_table;
   ```

   ````

3. 使用 `TO_TIMESTAMP` 函数和 `TO_CHAR` 函数的组合：如果要在转换过程中进行一些计算或调整，可以使用 `TO_TIMESTAMP` 函数将 `timestamp` 转换为特定格式的时间戳，然后再使用 `TO_CHAR` 函数将其格式化为字符串。例如，以下代码将 `timestamp` 转换为带有 AM/PM 标记的小时:分钟:秒 格式：
   ````sql
   SELECT TO_CHAR(TO_TIMESTAMP(timestamp_column), 'HH12:MI:SS AM') FROM your_table;
   ```
   ````

这些方法只是其中的几种，具体的选择取决于所需的时间格式和转换的要求。可以根据具体情况选择合适的方法。

## having 和 where 的区别

这里有另一种理解方法，WHERE 在数据分组前进行过滤，HAVING 在数据分组后进行过滤。这是一个重要的区别，WHERE 排除的行不包括在分组中。这可能会改变计算值，从而影响 HAVING 子句中基于这些值过滤掉的分组。
