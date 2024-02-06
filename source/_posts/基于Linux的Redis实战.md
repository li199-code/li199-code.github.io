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
