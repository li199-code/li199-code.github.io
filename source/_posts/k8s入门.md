---
title: k8s入门
date: 2024-03-16 10:10:36
tags:
  - k8s
  - devops
categories:
---

## 前言

我没想到有一天我会去学 k8s，但这是新公司要求的，现在我觉得我即将入职的岗位可能是 devops（development+operation, 开发+运维）。

首先，k8s 是 kubernetes 的简称，因为 k 和 s 之间有八个字母。我之前一直以为 8 来自 b，是国人的专属简称，哈哈。还有，orchestration, 编排，字面意义就是对容器的管理。

安装的话，我在笔记本的 windows 上和云主机的 centos7 上都安装失败了。笔记本上是想着按照虚拟机的方案模拟集群，但是 vmware 的 player 非常难用，换成基于 ubuntu 的轻量虚拟机 multipass 也失败了。最后发现，还是在线环境适合这种大型软件的学习。一共两个可选项：

---

killercoda
https://killercoda.com/playgrounds/scenario/kubernetes

---

---

play-with-k8s
https://labs.play-with-k8s.com/

---

play-with-k8s 的网页命令行不能执行复制粘贴，killercoda 不仅可以粘贴命令，而且是已经设置好集群了（包含控制平面和一个工作节点）。所以，推荐 killercoda。

## k8s 架构

![17106433391641710643338733.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/17106433391641710643338733.png)

## pod, replicaset, deploy, service

k8s 能操作的最小单元是 pod，而 pod 是容器组，可以包含多个容器。这样似乎就说明了，k8s 的常用操作不涉及容器，因此不必纠结于底层是 docker 还是 containerd 了。replicaset(副本集)又是 pod 的集合。然而 deploy 可以理解为 replicaset 的一种实现，并添加了很多特性，比如扩容、版本回滚等。

service 是一组 pod 所在的网络服务。

## yaml 文件编写

yaml 文件的四个必要部分：apiversion, kind, metadata, spec

一般 yaml 文件不要求从头写，而是从模板复制：

---

kubernetes 官方文档
https://kubernetes.io/zh-cn/docs/concepts

---

运行 yaml 文件的命令：`kubectl apply -f test.yaml`
