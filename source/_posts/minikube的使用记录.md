---
title: minikube的使用记录
summary: minikube在windows笔记本上的安装运行，kubectl的使用。
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
