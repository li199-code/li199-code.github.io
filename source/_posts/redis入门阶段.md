---
title: redis入门阶段
date: 2023-12-07 17:13:09
updated: 2023-12-07 17:13:09
tags: redis
categories:
---

## 前言

最近数据库方面在工作中锤炼的比较多。但是经历还是围绕 pgsql 这一关系型数据库上，redis 这种非关系型的数据库之前虽然学过，但是也基本忘了。这篇文章结合停车项目中 redis 的应用，来记录我是如何入门 redis 的。

## 安装

以前也在 windows 上安装过 redis，但因为 redis 官方不支持 windows，之前是用 github 社区支持的一种安装方案，安装过程有很多的 bug。在查阅 node-redis 的文档时，推荐用 docker 安装，打开了新世界的大门。这也启发我，如果没有 windows 版本的软件，可以用 docker 来代替。

```
docker run -p 6379:6379 -it redis/redis-stack-server:latest
```

这样，本机的 6379 端口就映射到了 docker 容器的 6379 端口，就和真的本机操作 redis 一样了。
