---
title: pytorch装环境
date: 2023-04-01 20:54:38
tags: pytorch
categories: 动手pytorch
---

## 问题描述

跟李沐学 AI，装环境时，发现无论是本地，还是切到 colab，都出现环境问题。甚至还有奇葩的要求装 gpu，但是 conda 返回的是 cpu 版本的 pytorch。conda 的包容易过期，pip 的包由容易污染环境，甚至一声不吭地卸掉别的包。国内源还出现找不到特定版本 cuda 的 torch。

只有 whl 安装方式是可靠且高效的。首先，whl 纯手动选择版本，其次，挂了 vpn 的情况下，下载速度很快。以后装深度学习环境，我只去 whl 下载。

## cuda 门道

对于有 GPU 的机器，需要下载 cuda 取代。然后输入`nvidia-smi`查看 cuda 版本。如下：

![](https://cdn.jsdelivr.us/gh/li199-code/blog-imgs@main/16804384729851680438472133.png)

CUDA 分为两种，驱动 API 和运行 API，驱动 API 指的是指的显卡驱动支持的最高 cuda 版本，我们运行程序时用的是运行 API。图片右上角的是去掉 API，显示 11.2。而运行`nvcc -V`查看运行 API：

![](https://cdn.jsdelivr.us/gh/li199-code/blog-imgs@main/16804385269811680438526702.png)

10.2. 所以驱动 API 一般高于运行 API。但是，当我们用 conda 虚拟环境时，还有另外一种情况：

> 这是平时我们所说的 CUDA 版本，由于运行 API 在 CUDA 里的 CUDA Toolkit 工具包中，所以运行 API 版本也是 CUDA Toolkit 工具包的版本。其实装了 Anaconda 之后 Anaconda 也会提供一个 cudatoolkit 工具包，同样包含了 CUDA 的运行 API，可以用来替代官方 CUDA 的 CUDA Toolkit。这也就是为什么有时候我们通过 nvcc-V 查看的 cuda 版本很低(比如 7.5)，但是能成功运行 cuda9.0 的 pytorch 的原因。因为在安装完 anaconda 后，运行 pytorch 代码就会使用 anaconda 的 cudatoolkit，而忽视官方的 CUDA Toolkit，所以我们只需要根据 anaconda 的 cudaoolkit 包的版本来安装相应的 pytorch 即可。

`conda list`查看 cudatoolkit 的版本。这里是 10.2。最终确定要安装的 torch+torchaudio+torchvision 组合一定要是 cuda10.

![](https://cdn.jsdelivr.us/gh/li199-code/blog-imgs@main/16804386679841680438667613.png)

## whl 安装

whl 的网站：https://download.pytorch.org/whl/cu102 。打开搜索，以 torch 为例，输入 torch，找对 python 和操作系统版本，开梯子，下载。然后，在本地命令行内，激活虚拟环境，然后切到下载目录，运行`pip install 包名`。
