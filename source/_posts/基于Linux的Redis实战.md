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

如果输入命令后出现报错：`(error) NOAUTH Authentication required.`, 说明在 Redis 配置文件中启用了身份验证（通常是 redis.conf 文件），则需要输入密码才能登录。使用以下命令输入密码：

```
AUTH your_password
```

**关闭 Redis 服务（可选）：**如果需要，您可以随时停止 Redis 服务：
`sudo systemctl stop redis`

这样，您就在 CentOS 上成功安装和配置了 Redis。您可以根据需要进一步配置 Redis，例如更改端口、设置密码等。

## 五大数据类型

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

五种数据类型分别是字符串、列表、哈希、集合、有序集合。都知道 redis 是一种键值对数据库，每种数据类型都体现了键值对。字符串、列表、集合比较简单，一级结构，键名对应的就是存储的数据。哈希和有序集合是二级结构，外层的键名指向数据结构的实例，内层的键名才是实际存值的地方。

有一个问题：如果我知道键名，但不知道数据类型，怎么获得值呢？

具体步骤如下：

- 使用 TYPE 命令确定键的数据类型。
- 根据数据类型执行相应的命令来获取值。

例如，假设你要获取名为 mykey 的键的值，但不确定其数据类型，可以按照以下步骤进行：

使用 TYPE 命令确定键的数据类型：`TYPE mykey`

根据返回的数据类型执行相应的命令来获取值。以下是不同数据类型的获取值的命令示例：

如果 mykey 的数据类型是字符串（string）：`GET mykey`

如果 mykey 的数据类型是列表（list）：`LRANGE mykey 0 -1`

如果 mykey 的数据类型是集合（set）：`SMEMBERS mykey`

如果 mykey 的数据类型是有序集合（sorted set）：`ZRANGE mykey 0 -1 WITHSCORES`

如果 mykey 的数据类型是哈希（hash）：`HGETALL mykey`

根据实际情况选择合适的命令来获取值。
