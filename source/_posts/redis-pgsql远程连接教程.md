---
title: redis, pgsql远程连接教程
author: Jason Lee
date: 2023-08-10 10:19:58
tags:
  - redis
  - postgresql
categories:
---

## 前言

部门在云服务器上开了 redis、postgresql 服务，供新员工练手。这就需要远程登录，这里对这两个工具的登录方式做一个记录。

## redis

前提是 redis 已经被安装，且被添加到环境变量的`path`中。在 cmd 中输入下列指令：

```
redis-cli -h <host> -p <port> -a <password>
```

然后，就会进入远程 redis 环境。

![16916343660851691634365179.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16916343660851691634365179.png)

ping 一下测试是否连通。redis 无法设置用户和数据库，所以没什么操作空间，除了设置键值对。

## pgsql

需要一个数据库连接管理软件，如 navicat 等。我装的是开源的 dbeaver。要新建数据库连接，点击“文件”下的新建连接，选择 pgsql。

![16916346250871691634624852.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16916346250871691634624852.png)

配置好账号密码后，连接。之后在导航栏中出现新的连接：

![16916347200811691634719114.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16916347200811691634719114.png)

右键“数据库”，点击新建数据库。在新建的数据库名右键，打开 sql 编辑器，用 create 语句创建表，新建的表所在目录如下：

![16916349940821691634993915.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16916349940821691634993915.png)
