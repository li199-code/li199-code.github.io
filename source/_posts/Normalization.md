---
title: Batch Normalization
date: 2023-04-02 20:31:59
tags: deep-learning
categories: 动手pytorch
---

## 前言

Batch Normalization （BN）层，通过将数据批量归一化（使其分布在N（0，1）），有下列好处：

> 缓解了梯度传递问题，使模型适应更大的学习率，加速了训练；
改善了饱和非线性模型不易训练的问题；
还起到了正则化的作用。

可以看出，BN和之前学到的Xavier初始化权重的目的类似，都是使训练更容易。

## 实现

BN的公式表达为：

$$\mathrm{BN}(\mathbf{x}) = \boldsymbol{\gamma} \odot \frac{\mathbf{x} - \hat{\boldsymbol{\mu}}_\mathcal{B}}{\hat{\boldsymbol{\sigma}}_\mathcal{B}} + \boldsymbol{\beta}.$$

$gamma$ $beta$都是可学习的参数，它们使得BN层像一个只有一个神经元的线性层。

```
import torch
from torch import nn
from d2l import torch as d2l


def batch_norm(X, gamma, beta, moving_mean, moving_var, eps, momentum):
    # 通过is_grad_enabled来判断当前模式是训练模式还是预测模式
    if not torch.is_grad_enabled():
        # 如果是在预测模式下，直接使用传入的移动平均所得的均值和方差
        X_hat = (X - moving_mean) / torch.sqrt(moving_var + eps)
    else:
        assert len(X.shape) in (2, 4)
        if len(X.shape) == 2:
            # 使用全连接层的情况，计算特征维上的均值和方差
            mean = X.mean(dim=0)
            var = ((X - mean) ** 2).mean(dim=0)
        else:
            # 使用二维卷积层的情况，计算通道维上（axis=1）的均值和方差。
            # 这里我们需要保持X的形状以便后面可以做广播运算
            mean = X.mean(dim=(0, 2, 3), keepdim=True)
            var = ((X - mean) ** 2).mean(dim=(0, 2, 3), keepdim=True)
        # 训练模式下，用当前的均值和方差做标准化
        X_hat = (X - mean) / torch.sqrt(var + eps)
        # 更新移动平均的均值和方差
        moving_mean = momentum * moving_mean + (1.0 - momentum) * mean
        moving_var = momentum * moving_var + (1.0 - momentum) * var
    Y = gamma * X_hat + beta  # 缩放和移位
    return Y, moving_mean.data, moving_var.data

class BatchNorm(nn.Module):
    # num_features：完全连接层的输出数量或卷积层的输出通道数。
    # num_dims：2表示完全连接层，4表示卷积层
    def __init__(self, num_features, num_dims):
        super().__init__()
        if num_dims == 2:
            shape = (1, num_features)
        else:
            shape = (1, num_features, 1, 1)
        # 参与求梯度和迭代的拉伸和偏移参数，分别初始化成1和0
        self.gamma = nn.Parameter(torch.ones(shape))
        self.beta = nn.Parameter(torch.zeros(shape))
        # 非模型参数的变量初始化为0和1
        self.moving_mean = torch.zeros(shape)
        self.moving_var = torch.ones(shape)

    def forward(self, X):
        # 如果X不在内存上，将moving_mean和moving_var
        # 复制到X所在显存上
        if self.moving_mean.device != X.device:
            self.moving_mean = self.moving_mean.to(X.device)
            self.moving_var = self.moving_var.to(X.device)
        # 保存更新过的moving_mean和moving_var
        Y, self.moving_mean, self.moving_var = batch_norm(
            X, self.gamma, self.beta, self.moving_mean,
            self.moving_var, eps=1e-5, momentum=0.9)
        return Y
```

预测和训练时BN层的作用方式不同。主要是因为训练时BN层是根据批量数据的均值方差来估计整个数据集的均值方差。训练是用了一个滑动估计下来的保留均值方差，BN层用它来在测试时归一化。

## 我的实践

在我的弱光照增强网络中，Unet结构在卷积层中也大量采用了BN层。由于显存的限制（8G），我的batch_size是8，EnlightenGAN作者设为32。我的担心是，batch_size设的太小会不会导致BN层失效？chatgpt的回答是：

> 即使你的batch_size很小，使用批量归一化（Batch Normalization）也是有益的，因为它可以使神经网络训练更加稳定和快速。以下是几个原因：
减少内部协变量偏移（Internal Covariate Shift）：内部协变量偏移是指在每一层输入的分布随着网络的训练而发生变化，这会导致网络训练变得困难。批量归一化通过在每个小批量上标准化输入，可以有效地减少内部协变量偏移的影响。
提高梯度传播：批量归一化可以缩小每层的激活值范围，使得梯度更容易传播，从而加快训练速度。
增强正则化：批量归一化可以在每个小批量上对激活进行标准化，这相当于对每个激活值都进行了一定的正则化，从而可以减少过拟合的风险。
虽然batch_size较小时批量归一化的效果可能不如batch_size较大时显著，但仍然可以提高神经网络的性能。因此，我建议在训练神经网络时，无论batch_size的大小，都使用批量归一化。


> 如果将batch_size设置为1，那么使用批量归一化（Batch Normalization）的效果会受到影响，因为它需要在每个小批量上计算均值和方差来进行标准化。当batch_size为1时，每个小批量只有一个样本，这样计算出来的均值和方差可能不太准确，因此批量归一化的效果可能会降低。
不过，对于某些特殊的任务或架构，有些人可能会在batch_size为1时使用批量归一化。这时可以考虑使用“自适应批量归一化”（Adaptive Batch Normalization）或“实例归一化”（Instance Normalization）等变种方法，它们可以在batch_size为1时进行标准化。但需要注意的是，这些方法可能不如标准批量归一化在大批量数据上的效果好，所以在选择是否使用它们时需要根据具体情况进行权衡。

所以，应该还是可以用的。