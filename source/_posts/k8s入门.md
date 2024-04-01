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

service 是一组 pod 所在的网络服务。service 配置文件的 port 和 targetport 区别：

port：这是 Service 本身暴露给集群内其他 Pod 或外部用户的端口号。当其他应用程序或服务想要与 Service 通信时，它们将使用该端口。例如，如果你有一个 Web 应用程序，你可能会将端口设置为 80（HTTP）或 443（HTTPS）。

targetPort：这是 Service 用来连接后端 Pod 的端口号。当 Service 接收到来自外部的请求时，它将流量路由到目标端口上。这个端口对应于 Service 所指向的后端 Pod 中运行的应用程序的端口。例如，如果你的后端应用程序在容器中监听 3000 端口，你会将 targetPort 设置为 3000。

举例来说，假设你有一个运行在容器内的 Web 服务器，该服务器监听 3000 端口。你可以创建一个 Service，将 Service 的端口设置为 80（用于外部访问），将 targetPort 设置为 3000（用于与后端 Pod 通信）。这样，当外部用户访问 Service 时，流量将被路由到 Pod 的 3000 端口上。

## yaml 文件编写

yaml 文件的四个必要部分：apiversion, kind, metadata, spec

一般 yaml 文件不要求从头写，而是从模板复制：

---

kubernetes 官方文档
https://kubernetes.io/zh-cn/docs/concepts

---

运行 yaml 文件的命令：`kubectl apply -f test.yaml`

另外，yaml 文件还有一个实时更新的部分：status。它记录了当前状态和 yaml 文件的目标状态之间的差异。

## 更新

用 minikube 尝试来管理容器，其实也挺好用的。只不过，minikube 的默认启动命令是`minikube start`，如果不在后面加上`--nodes x`，就是一个控制节点，但是又能同时实现工作节点的功能，即运行容器。
