---
title: 用虚拟机代替云服务器—学习linux系统的一种选择
date: 2024-01-26 22:59:47
tags:
categories:
---

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
