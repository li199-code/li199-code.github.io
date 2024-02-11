---
title: 基于Linux的Redis实战
date: 2024-02-06 21:34:31
tags: redis
categories:
---

## 安装

**更新系统：**首先，确保您的系统已经更新到最新版本。您可以通过以下命令执行此操作：

`sudo yum update`
**安装 Redis：**使用 yum 包管理器安装 Redis：

`sudo yum install redis`
**启动 Redis 服务：**安装完成后，启动 Redis 服务：
`sudo systemctl start redis`
**设置 Redis 开机自启动：**如果您希望 Redis 在系统启动时自动启动，可以执行以下命令：

`sudo systemctl enable redis`
**验证 Redis 是否正在运行：**您可以使用以下命令检查 Redis 服务的运行状态：

`sudo systemctl status redis`
如果一切正常，您应该会看到 Redis 正在运行的输出。

**测试 Redis：**您可以使用 redis-cli 命令行工具连接到 Redis 服务器并执行一些基本操作，例如设置键值对、获取键值对等：

`redis-cli`
**关闭 Redis 服务（可选）：**如果需要，您可以随时停止 Redis 服务：

`sudo systemctl stop redis`
这样，您就在 CentOS 上成功安装和配置了 Redis。您可以根据需要进一步配置 Redis，例如更改端口、设置密码等。

## 用 python 连接 redis

因为《redis 实战》这本书中的示例代码是用 python，所以这篇文章也以 python 为媒介来学习 redis。

Python 中有几个常用的 Redis 客户端库，其中最流行的是 redis-py。以下是 redis-py 中一些常用的 API 及其用法：

- 连接到 Redis 服务器：

```py

import redis

# 创建 Redis 连接
r = redis.Redis(host='localhost', port=6379, db=0)

# 或者使用连接池
pool = redis.ConnectionPool(host='localhost', port=6379, db=0)
r = redis.Redis(connection_pool=pool)
```

- 字符串操作：

```py

# 设置键值对
r.set('key', 'value')

# 获取值
value = r.get('key')

# 批量设置键值对
r.mset({'key1': 'value1', 'key2': 'value2'})

# 批量获取值
values = r.mget(['key1', 'key2'])
```

- 哈希操作：

```py
# 设置哈希值
r.hset('hash_key', 'field', 'value')

# 获取哈希值
value = r.hget('hash_key', 'field')

# 批量设置哈希值
r.hmset('hash_key', {'field1': 'value1', 'field2': 'value2'})

# 批量获取哈希值
values = r.hmget('hash_key', ['field1', 'field2'])
```

- 列表操作：

```py
# 在列表左侧添加元素
r.lpush('list_key', 'value1', 'value2')

# 在列表右侧添加元素
r.rpush('list_key', 'value3', 'value4')

# 获取列表范围内的元素
values = r.lrange('list_key', 0, -1)
```

- 集合操作：

```py
# 添加元素到集合
r.sadd('set_key', 'member1', 'member2')

# 获取集合所有成员
members = r.smembers('set_key')

# 从集合中移除元素
r.srem('set_key', 'member1')
```

- 有序集合操作：

```py
# 添加元素到有序集合
r.zadd('zset_key', {'member1': 1, 'member2': 2})

# 获取有序集合范围内的元素
members = r.zrange('zset_key', 0, -1, withscores=True)
```
