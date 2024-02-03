---
title: sql优化工具——学会看执行计划
date: 2024-01-08 22:01:24
tags: sql优化
categories:
---

## 预备知识

### 查询 sql 语句执行顺序

```
(8) SELECT (9)DISTINCT<Select_list>
(1) FROM <left_table> (3) <join_type>JOIN<right_table>
(2) ON<join_condition>
(4) WHERE<where_condition>
(5) GROUP BY<group_by_list>
(6) WITH {CUBE|ROLLUP}
(7) HAVING<having_condtion>
(10) ORDER BY<order_by_list>
(11) LIMIT<limit_number>
```

具体说明详见：

---

SQL 的书写顺序和执行顺序
https://zhuanlan.zhihu.com/p/77847158

---

### 优化目标

在前一段时间写了不下百段的逻辑库后，sql 优化将是我下一阶段的学习方向，它和业务表现息息相关。奇怪的是，它并没有在任何一个路线图上出现，尽管它其实非常重要。

首先明确什么是 sql 优化：

> SQL 优化，就是指将一条 SQL 写的更加简洁，让 SQL 的执行速度更快，易读性与维护性更好。

其中，快自然是首要的优化目标，至于易读性嘛，只能说兼顾，毕竟大家都是在屎山上拉屎的那个。那么如何定义一段好的 sql 语句呢，标准如下：

> 减小查询的数据量、提升 SQL 的索引命中率

另外，从测试指标上，最基本的有执行时间，这在 navicat 上都有显示。遇到一条执行慢的 sql，应该先用 explain 命令得到查询计划，里面有很多有用的信息。

## 看懂 pgsql 上的执行计划

首先，最重要的，分清一次查询有没有走了索引: seq scan 是全表扫描，index scan / Bitmap Index Scan / Index Only Scan 是走了索引。

rows 是优化器预估的返回的行数，不是扫描的行数。rows 主要是为优化器选择合适的执行计划做参考的。

条件过滤：出现 Filter。

**嵌套循环连接**，一般来说，这个是导致 sql 变慢的重要原因之一。在联结（join）操作时就会出现。优化的基本原则是小表驱动大表。下面是一个包含 Nest Loop Join 的简单执行计划的示例：

```sql
EXPLAIN SELECT *
FROM table1
JOIN table2 ON table1.column_id = table2.column_id;
```

这里是一个示例执行计划的输出：

```
Nested Loop Join
  (cost=1000.00..2500.00 rows=100 width=32)
  -> Seq Scan on table1
        (cost=0.00..500.00 rows=50 width=16)
  -> Index Scan using index_column_id on table2
        (cost=500.00..1000.00 rows=50 width=16)
        Index Cond: (table1.column_id = table2.column_id)
```

在这个执行计划中，可以看到：

- Nested Loop Join 表示使用了 Nest Loop Join。
- Seq Scan on table1 表示对 table1 进行了顺序扫描，即全表扫描。
- Index Scan using index_column_id on table2 表示对 table2 使用了索引扫描。
- Index Cond: (table1.column_id = table2.column_id) 表示连接条件是基于列 column_id 的相等条件。

散列连接（Hash Join）是数据库查询中一种常见的连接算法，用于将两个表的数据连接起来。与 Nest Loop Join 不同，Hash Join 的连接过程不是基于嵌套循环，而是通过散列算法将连接条件的列的值映射到一个散列表中，然后在散列表中查找匹配的行。

以下是 Hash Join 的基本步骤：

- 构建散列表：将连接条件的列的值通过散列算法映射到散列表中。
- 将第一个表的每一行添加到散列表中。
- 遍历第二个表的每一行，通过散列算法找到散列表中匹配的行。
  相比于 Nest Loop Join，Hash Join 的优势主要体现在以下几个方面：

- 性能： 在某些情况下，Hash Join 的性能可能比 Nest Loop Join 更好。特别是在连接大型表时，Hash Join 的性能通常更高效，因为它可以利用散列表的快速查找特性。

- 适用于等值连接： Hash Join 通常用于等值连接（即连接条件是相等关系），而 Nest Loop Join 更适合处理其他类型的连接条件。如果连接条件是等值关系，Hash Join 可能会更为高效。

- 适用于大型表： 当连接的表很大时，Hash Join 可以更好地利用内存，因为它在内存中构建散列表。这有助于减少 I/O 操作，提高查询性能。

然而，Hash Join 也有一些限制，例如对内存的需求较高，如果内存不足可能导致性能下降。因此，在选择连接算法时，需要根据具体的查询和表结构来进行优化。数据库优化器通常会根据统计信息和查询条件选择合适的连接策略。
