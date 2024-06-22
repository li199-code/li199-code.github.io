---
title: K8S Services解释
summary: 对四种k8s service类型做了说明，给出了它们的工作场景。
date: 2024-06-22 18:52:40
tags: k8s
---

## 前言

从我个人角度来看，service 是 k8s 最容易出问题的地方。网络不通是最常见的问题，想要排查网络，就要对 service 有一个深入的理解。

## ClusterIP Service

![clusterIP工作场景](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17190591816891719059180297.png)

ClusterIP 是 service 的一种类型，负责管内部的网络通信。k8s 中，每个 pod 都有独立的 ip，但是 pod 是非稳定的，很容易创建销毁，ip 地址也随之改变。clusterIP 的 service 就是通过 selector 确定请求转发到哪种 pod，还有 targetPort 属性确定 pod 的 port。targetPort 必须和容器监听的 port 相同。

## Headless Service

![headless 工作场景](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17190647224751719064721585.png)

ClusterIP 有自己的 ip，Headless 就是不分配 ip 的服务。上图中，两个 mongo-db 节点中的 pod 想要相互通信（比如主从数据同步），就要通过 headless service。

## nodePort Service

![NodePort工作场景](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17190651734751719065172873.png)

nodePort 是节点机器上的一个端口， nodePort 可以直接被 Ingress 或者外部请求访问到。它的数值范围是 30000-32767. nodePort 被创建，同时意味着有一个内部的 clusterIP service 被创建。

## loadBalancer Service

![loadBalancer工作场景](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17190655884871719065587171.png)

等于是在 nodePort service 之外又套了一个 loadBalancer，意味着创建了 loadBalancer，同时也创建了 nodePort 和 ClusterIP。

![17190658904841719065889152.png](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/17190658904841719065889152.png)

在生产环境中，出于安全考虑，应该用 Ingress 或者 loadBalancer service 处理外部请求，而不是 nodePort。
