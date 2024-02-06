---
title: 分布式nodejs的学习心得
date: 2024-02-03 20:10:56
tags: nodejs
categories:
---

## 准备工作

在云服务器的 centos 系统上需要先设置好开发环境。首先是 git 安装，并下载好书的配套代码：

```bash
yum update
yum install git
```

然后安装 nvm：

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash ## curl运行会卡住
# 打开一个新的标签页后，接着输入命令
nvm -v
nvm install 16
nvm use 16
node -v
```

## 第三章 扩展

上来的第一节先介绍了 node 原生的 cluster（集群）模块。主要作用是通过`cluster.fork()`方法在同一台机器上复制 node 实例的多个副本。书中通过几个例子说明了，cluster 能在多核 cpu 上提高吞吐量和响应速度，但是在单核上进行集群扩展的性能反而不如单核，这是因为一个核心一次只能运行一个 node 实例。更加值得一提的是，书中提到了一个测试工具：autocannon。使用过程如下：

```bash
autocannon -c 2 http://127.0.0.1:4000/10000
```

![17069636893951706963689188.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/17069636893951706963689188.png)

还有一个将进程强制在某一个核心上运行的命令：taskset.

```bash
taskset -cp 0 <pid>
```
