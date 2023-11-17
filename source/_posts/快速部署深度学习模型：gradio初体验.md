---
title: 快速部署深度学习模型：gradio初体验
author: Jason Lee
date: 2023-07-06 20:47:44
tags: 
- gradio
- deep-learning
categories:
---

## 前言

需求：将机器学习的模型变成网页应用，并部署到公网上用于访问。

前几个月，当时也有类似的需求，想将自己毕业论文中的一个图像处理模型部署到公网。当时考虑的是，用django或者flask结合pytorch在本地搭一个应用，实现图片进出预训练模型的逻辑，然后用内网穿透的工具，使得外部可以访问到我的主机。但是这就带来许多问题，比如当时找了好几个内网穿透工具，要么收费，要么不好用。而且，主机总会有关机的时候，那么关机后服务也就停止了。一时间迟迟无法入手，当时就暂时放弃了。前阵子听说了gradio这个好东西，一个python包，通过几行代码，就可以在本地起一个应用，不仅带有简洁的UI，而且内置了内网穿透。当时觉得很困难的问题，竟然一下迎刃而解了。感叹现在深度学习社区发展的速度。

## gradio本地运行

下面以知乎上的rgb2gray为例，讲解gradio库的使用。新建一个虚拟环境，安装上gradio包：

```
pip install -Uq gradio ## -U表示安装最新版本的包，-q表示静默安装，避免命令行污染
```

新建一个app.py：

```
import gradio as gr
import cv2

def to_black(image):
    output = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return output

interface = gr.Interface(fn=to_black, inputs="image", outputs="image")
interface.launch(share=True)
```

运行py文件，gradio在本地启动一个 HTTP 服务器，并通过内网穿透将该服务器暴露给公共互联网。局域网和公网链接都会输出在命令行终端。但是生成的公网链接会在72小时后过期，因此它是一个临时链接。如果要实现永久访问，需要将代码以及预训练模型（如有）上传到huggingface space上。

## huggingface space

huggingface space是一个类似github的地方，可以用来存py文件和预训练模型，并且在和gradio绑定后，可以实现免费的部署。如果是新电脑，运行`gradio deploy`，按指示添加write token，绑定huggingface账号。也可以通过git clone命令，下载空间到本地再修改。新建space时的信息：

![16886436128041688643612164.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16886436128041688643612164.png)

除了一个基础的cpu是免费的，其他都是按小时收费的。说实话还是蛮贵的，比如T4 gpu，colab和kaggle都是免费提供的，这里收0.6美刀/小时。当代码每次有更改时，空间会自动刷新并运行一次，可通过点击红框内的按钮查看进度：

![16886441928151688644192174.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16886441928151688644192174.png)

成功之后，可以通过分享这个space的链接，来实现在线演示。

ps: 如何找到自己创建过的space。要通过点击头像，进入个人主页。

## 访问速度对比

这里做一个简单的测试，本例的rgb2gray是一个非常简单的函数，cpu都能瞬间完成，下面分别测试gradio在代码存在本地时通过localhost和内网穿透以及代码在hf space下的处理速度。图片尺寸为1280*853，浏览器为firefox。

|方式|时间（估计）|使用场景|
|--|--|--|
|localhost|0.4s|本地演示给自己或者旁边的人看|
|内网穿透|24s|有外部访问的需求，且本地有gpu，能覆盖网速带来的负面影响|
|hf space|4s|有外部访问或者长时间保持服务的需求，可以购买gpu时长|

可以看出，内网穿透最慢，localhost最快。也可以理解，内网穿透的网络传输方式最复杂，受网速波动影响大。

## api

除了gradio提供的UI，也可以自己设计UI，并利用gradio提供的api接口，实现模型推理。但是，当我按照文档的代码运行时，遇到了报错：

```
ConnectionResetError: [WinError 10054] 远程主机强迫关闭了一个现有的连接。
```

现在暂时未解决。

## 结语

记录了gradio的初级用法，并给出了不同场景下的使用方案。有了gradio，深度学习模型部署变得省事多了。
