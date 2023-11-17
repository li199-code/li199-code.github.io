---
title: pytorch装环境
date: 2023-04-01 20:54:38
tags: pytorch
categories: 动手pytorch
---

## 问题描述

跟李沐学AI，装环境时，发现无论是本地，还是切到colab，都出现环境问题。甚至还有奇葩的要求装gpu，但是conda返回的是cpu版本的pytorch。conda的包容易过期，pip的包由容易污染环境，甚至一声不吭地卸掉别的包。国内源还出现找不到特定版本cuda的torch。

只有whl安装方式是可靠且高效的。首先，whl纯手动选择版本，其次，挂了vpn的情况下，下载速度很快。以后装深度学习环境，我只去whl下载。

## cuda门道

对于有GPU的机器，需要下载cuda取代。然后输入`nvidia-smi`查看cuda版本。如下：

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16804384729851680438472133.png)

CUDA分为两种，驱动API和运行API，驱动API指的是指的显卡驱动支持的最高cuda版本，我们运行程序时用的是运行API。图片右上角的是去掉API，显示11.2。而运行`nvcc -V`查看运行API：

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16804385269811680438526702.png)

10.2. 所以驱动API一般高于运行API。但是，当我们用conda虚拟环境时，还有另外一种情况：

> 这是平时我们所说的CUDA版本，由于运行API在CUDA里的CUDA Toolkit工具包中，所以运行API版本也是CUDA Toolkit工具包的版本。其实装了Anaconda之后Anaconda也会提供一个cudatoolkit工具包，同样包含了CUDA的运行API，可以用来替代官方CUDA的CUDA Toolkit。这也就是为什么有时候我们通过nvcc-V查看的cuda版本很低(比如7.5)，但是能成功运行cuda9.0的pytorch的原因。因为在安装完anaconda后，运行pytorch代码就会使用anaconda的cudatoolkit，而忽视官方的CUDA Toolkit，所以我们只需要根据anaconda的cudaoolkit包的版本来安装相应的pytorch即可。

`conda list`查看cudatoolkit的版本。这里是10.2。最终确定要安装的torch+torchaudio+torchvision组合一定要是cuda10.

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16804386679841680438667613.png)

## whl安装

whl的网站：https://download.pytorch.org/whl/cu102 。打开搜索，以torch为例，输入torch，找对python和操作系统版本，开梯子，下载。然后，在本地命令行内，激活虚拟环境，然后切到下载目录，运行`pip install 包名`。



