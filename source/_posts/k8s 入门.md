---
title: k8s 入门
tags:
  - k8s
  - devops
abbrlink: b702da18
date: 2024-03-16 10:10:36
categories:
summary: 每看一次nana的k8s教程，都会有新的收获。记录一下自己对k8s的理解。
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

## 基础概念

node(节点)，一个集群至少包含一个控制平面和一个节点。一个节点通常映射到一个物理服务器或一个虚拟机。节点上的组件包括 kubelet、 容器运行时以及 kube-proxy。

k8s 能操作的最小单元是 pod，大多数应用场景下，一个 Pod 只包含一个容器。

Deplyment 下的 replica 属性规定了 pod 的集合内容器。有了 deployment，意味着应用容器挂掉可以马上转到新的一模一样的容器中，而没有任何 downtime.

statefulset 类似于 deployment，但是针对于有状态的应用（如数据库）。deployment 只记录了无状态应用的 blueprint，而 statefulset 还保存了有状态应用的状态信息。（注：如果数据库只有单节点而非集群，也可以用 deployment 管理，只需要配置好 volumn 即可）

Service 是将运行在一个或一组 Pod （一组内的 pod 应该具有相同的功能）上的网络应用程序公开为网络服务的方法。具体而言，Service 提供了三个功能：标签选择器（Label Selector）、稳定的网络标识、负载均衡。其中，稳定的网络标识是核心。Service 为其选择的一组 Pods 提供一个稳定的 IP 地址和 DNS 名称。无论 Pod 的 IP 地址如何变化，客户端都可以通过 Service 的 IP 地址或 DNS 名称来访问这些 Pods。

Ingress 是指在访问域名而非 ip 地址时，需要先经过 Ingress（DNS？）

service 配置文件的 port 和 targetport 区别：

port：这是 Service 本身暴露给集群内其他 Pod 或外部用户的端口号。当其他应用程序或服务想要与 Service 通信时，它们将使用该端口。例如，如果你有一个 Web 应用程序，你可能会将端口设置为 80（HTTP）或 443（HTTPS）。

targetPort：这是 Service 用来连接后端 Pod 的端口号。当 Service 接收到来自外部的请求时，它将流量路由到目标端口上。这个端口对应于 Service 所指向的后端 Pod 中运行的应用程序的端口。例如，如果你的后端应用程序在容器中监听 3000 端口，你会将 targetPort 设置为 3000。

举例来说，假设你有一个运行在容器内的 Web 服务器，该服务器监听 3000 端口。你可以创建一个 Service，将 Service 的端口设置为 80（用于外部访问），将 targetPort 设置为 3000（用于与后端 Pod 通信）。这样，当外部用户访问 Service 时，流量将被路由到 Pod 的 3000 端口上。

configMap: 明文配置；secret: 不方便给外界看的配置。

## k8s 架构

![k8s集群架构](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17183477058631718347705420.png)

每个工作节点内部必须有三个进程：

- kubelet 负责 pod 的创建
- kube proxy 负责 pod 请求的转发
- 容器运行时

控制节点也可以不止一个。控制平面管理集群中的所有操作。主要组件包括：

- API Server：集群的入口，接收和处理所有的 REST 请求。
- etcd：一个高可用的键值存储，用于存储集群的所有数据。
- Controller Manager：运行控制器，确保集群的期望状态和实际状态一致。
- Scheduler：负责将新创建的 Pod 分配到适当的工作节点上。

作为一个如此复杂的工具，我们应该知道什么东西是需要人来配置，什么东西是工具自己来调节操控的。**Deployment 以下的，都是 k8s 自主调节。**

## yaml 文件编写

yaml 文件的四个必要部分：apiversion, kind, metadata, spec

- apiVersion: 指定资源的 API 版本，例如 v1。
- kind: 指定资源的类型，例如 Pod、Service、Deployment 等。
- metadata: 提供资源的元数据，例如名称、命名空间、标签等。
- spec: 指定资源的具体配置，内容根据资源类型的不同而有所不同。

一份示例 yaml 文件：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
  labels:
    app: myapp
spec:
  containers:
    - name: mycontainer
      image: nginx:latest
      ports:
        - containerPort: 80
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mydeployment
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: mycontainer
          image: nginx:latest
          ports:
            - containerPort: 80
```

一般 yaml 文件不要求从头写，而是从模板复制：

---

kubernetes 官方文档
https://kubernetes.io/zh-cn/docs/concepts

---

运行 yaml 文件的命令：`kubectl apply -f test.yaml`

另外，yaml 文件还有一个实时更新的部分：status。它记录了当前状态和 yaml 文件的目标状态之间的差异。
