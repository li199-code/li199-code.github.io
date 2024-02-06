---
title: redis入门阶段
date: 2023-12-07 17:13:09
updated: 2023-12-07 17:13:09
tags: redis
categories:
---

## 前言

最近数据库方面在工作中锤炼的比较多。但是经历还是围绕 pgsql 这一关系型数据库上，redis 这种非关系型的数据库之前虽然学过，但是也基本忘了。这篇文章结合停车项目中 redis 的应用，来记录我是如何入门 redis 的。

## 安装和登录

### docker

除非登录容器的 shell 窗口，否则无法直接输入 redis 命令。适合代码控制 redis。

```
docker run -p 6379:6379 -it redis/redis-stack-server:latest
```

这样，本机的 6379 端口就映射到了 docker 容器的 6379 端口，就和真的本机操作 redis 一样了。

### 本地安装

```
https://github.com/tporadowski/redis/releases
```

选择 msi 下载，一路确定安装。进入安装目录后，打开 cmd，输入：

```
redis-server.exe redis.windows.conf
```

这一步可能出现的报错： Could not create server TCP listening socket 127.0.0.1:6379: bind: 操作成功完成。原因是 6379 端口已绑定。应该是因为上次服务没有关闭。依次输入命令来关闭旧连接：

```
redis-cli
shutdown
exit
```

成功启动 redis 服务后，需要进入 redis 命令行窗口：

```
redis-cli.exe -h 127.0.0.1 -p 6379
```

如果输入命令后出现报错：`(error) NOAUTH Authentication required.`, 说明在 Redis 配置文件中启用了身份验证（通常是 redis.conf 文件），则需要输入密码才能登录。使用以下命令输入密码：

```
AUTH your_password
```
