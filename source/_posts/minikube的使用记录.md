---
title: minikube的使用记录
summary: minikube在windows笔记本上的安装运行，kubectl的使用，yaml文件的编写
date: 2024-06-19 21:44:57
tags: k8s
---

## 前言

k8s 一直以概念繁杂著称。在容器编排这个领域，它是统治级的存在，可以说它就代表了这个领域内的几乎所有知识。因为我对这个领域并不熟悉，所以很难记住这些概念。只能一次次地翻看基础教程。

k8s 的背景是容器化部署盛行，加上微服务要求，一个系统的容器数量成百上千，这样，必须有一个专门的编排工具，达到高可用、可伸缩等目的。

在之前写的[k8s 入门](https://blog.jasonleehere.com/posts/b702da18.html)中，介绍了两个在线平台运行 k8s 命令。其实，本地也可以运行 minikube 这个精简版。下面记录一下它的使用过程。

## 安装

![minikube架构](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17188050260521718805025772.png)

简而言之，一个节点中包含了控制进程和工作进程，因此一台笔记本也能模拟 k8s 集群。

---

minikube 文档
https://minikube.sigs.k8s.io/docs/

---

minikube 的默认启动命令是`minikube start`，命令行启动界面：

![minikube启动界面](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17187761890551718776188800.png)

可以看出，我本机上的 minikube 版本号为 1.32.0，且使用到了预装的 docker 和 kubectl，k8s 的版本号为 1.28.3. 启动后，docker desktop 显示多了一个 minikube 容器，是为 node。

## kubectl

---

kubectl cheat sheet
https://spacelift.io/blog/kubernetes-cheat-sheet

---

kubectl 是一个命令行工具，需要单独安装。通过它，操控 k8s 的各级资源。

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

运行 yaml 文件的命令：`kubectl apply -f test.yaml`。

spec 下的 replicas 字段指 pod 数量，不论 kind 是 deployment 或者 replicaset。

另外，yaml 文件还有一个实时更新的部分：status。它记录了当前状态和 yaml 文件的目标状态之间的差异。

labels 作用：template 下的 labels 是给一种 pod 打上相同的标签；selector 下的 matchLabels 则是告诉 Deployment，replicas 是使用该标签下的 pod。

### service 下的 port/targetport/nodePort

可以把 service 想象为一台完整的机器。既有接受外部请求的端口（port），又有内部的容器（pod）监听的端口（targetPort）。

port：这是 Service 本身暴露给集群内其他 Pod 或外部用户的端口号。当其他应用程序或服务想要与 Service 通信时，它们将使用该端口。例如，如果你有一个 Web 应用程序，你可能会将端口设置为 80（HTTP）或 443（HTTPS）。

targetPort：这是 Service 用来连接后端 Pod 的端口号。当 Service 接收到来自外部的请求时，它将流量路由到目标端口上。这个端口对应于 Service 所指向的后端 Pod 中运行的应用程序的端口。例如，如果你的后端应用程序在容器中监听 3000 端口，你会将 targetPort 设置为 3000。

最后，nodePort 只存在于 external service 中，表示暴露给 k8s 外的 client 的端口。

## Nana 教程中 mongo-express 例子最后的坑

在例子的最后，命令行执行`minikube service mongo-express-service`后，有如下日志：

![命令行输出](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17188988784971718898877642.png)

下面那行才是本机浏览器可访问的地址。只是还需要账号密码。nana 的视频并不需要输入账号密码。在 stackoverflow 上找到答案，这里的账号密码是 mongo-express 要求提供的，默认是 admin:pass。
