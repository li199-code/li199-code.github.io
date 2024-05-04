---
title: clickhouse 入门
date: 2024-04-02 13:29:21
tags: clickhouse
categories:
---

## 概念

所谓的列式数据库，是指数据在物理上是按列存储的，而抽象的二维表结构和行式数据库是一样的。如下图：

行式：

![17120436082921712043607431.png](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17120436082921712043607431.png)

列式：

![17120436512831712043650838.png](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17120436512831712043650838.png)

## 副本、分片

节点即机器。分区是指在一台节点上按照某几个字段的值范围区分；分片则是分布式的概念，将数据分成几块散落在多个节点中。
