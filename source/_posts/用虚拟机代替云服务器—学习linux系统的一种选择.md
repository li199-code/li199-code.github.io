---
title: 在ubuntu系统上操作postgresql
date: 2024-01-26 22:59:47
tags:
  - linux
  - postgresql
categories:
---

## 用虚拟机代替云服务器—学习 linux 系统的一种选择

这几天在学习 pgsql，用 windows 环境有诸多限制，比如很多监听工具只能跑在 linux。一开始，我是想买一台云服务器的，但是后来发现，根据自己的需求，只要一台本地的 linux 虚拟机就可以实现了。本地虚拟机可以联网，可以下载安装包。这就够了。

我的电脑之前装过虚拟机，故接下来的步骤是开放 22 端口方便外部通过 ssh 连接。运行下列命令：

```bash
sudo apt update
sudo apt install openssh-server //openssh提供ssh服务
sudo service ssh status //查看ssh服务状态
```

![17062817371461706281736260.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/17062817371461706281736260.png)

出现上述界面即为成功。然后获取虚拟机的 ip 地址：

```bash
ifconfig
```

查看 ens33 后面的 inet 地址。回到 xshell，新建连接，把 ip 地址填入，输入用户名密码（用户名似乎不能是 root），即可连接。

## 安装 postgresql

- 更新软件包列表：

打开终端，运行以下命令：

```bash
sudo apt update
```

- 安装 PostgreSQL：

继续运行以下命令安装 PostgreSQL：

```bash
sudo apt install postgresql postgresql-contrib
```

这将安装 PostgreSQL 数据库服务器和一些附加组件。

- 启动 PostgreSQL 服务：

安装完成后，PostgreSQL 服务将自动启动。如果没有，你可以手动启动它：

```bash
sudo service postgresql start
```

- 创建一个 PostgreSQL 用户：

默认情况下，PostgreSQL 安装时会创建一个名为 postgres 的系统用户，也会创建一个相应的数据库用户。为了方便，我们可以切换到 postgres 用户并进入 PostgreSQL 命令行：

```bash
sudo -u postgres psql
```

- 为用户设置密码：

在 PostgreSQL 命令行中，可以为 postgres 用户设置密码：

```sql
ALTER USER postgres PASSWORD 'your_password';
```

将 'your_password' 替换为你想要设置的密码。

- 退出 PostgreSQL 命令行：

在 PostgreSQL 命令行中，键入以下命令退出：

```sql
\q
```

然后，通过键入 exit 或关闭终端来退出 postgres 用户。

- 访问 PostgreSQL：

你现在可以使用新设置的密码通过以下命令登录到 PostgreSQL：

```bash
psql -U postgres -h localhost -d postgres
```

这将提示输入密码，输入之前设置的密码即可登录。
