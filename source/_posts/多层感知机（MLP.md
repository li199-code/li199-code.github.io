---
title: 多层感知机（MLP)
date: 2023-03-25 14:59:43
tags: deep-learning
categories: 动手pytorch
---
终于从前面的单层网络linear-regression和softmax过渡到多层神经网络了。为了对更加复杂的数据进行学习，多层感知机将多个全连接层叠加，并增加激活函数。激活函数是非线性的，因为如果不加激活函数或者激活函数线性，那么多层神经网络还是遵循线性规律，等同于一层。

![多层感知机](https://files.catbox.moe/i5059a.png)

中间的，就是隐藏层。所以，多加的隐藏层中神经元的个数也是一个超参数。

## 从零实现代码

```python
import torch
from torch import nn
from d2l import torch as d2l

batch_size=256
train_iter, test_iter = d2l.load_data_fashion_mnist(batch_size)
```

```python
num_inputs, num_outputs, num_hiddens = 784, 10, 784

W1 = nn.Parameter(torch.randn(num_inputs, num_hiddens, requires_grad=True) * 0.01)
b1 = nn.Parameter(torch.zeros(num_hiddens, requires_grad=True))
W2 = nn.Parameter(torch.randn(num_hiddens, num_outputs, requires_grad=True) * 0.01)
b2 = nn.Parameter(torch.zeros(num_outputs, requires_grad=True))

params = [W1, b1, W2, b2]
```

```python
def relu(X):
    a = torch.zeros_like(X)
    return torch.max(X, a)
```

```python
def net(X):
    X = X.reshape((-1, num_inputs))
    H = relu(X@W1 + b1)
    return (H@W2 + b2)
```

```python
loss = nn.CrossEntropyLoss(reduction='none')
```

```python
num_epochs, lr = 10, 0.1
updater = torch.optim.SGD(params, lr=lr)
d2l.train_ch3(net, train_iter, test_iter, loss, num_epochs, updater)
```

```python
d2l.predict_ch3(net, test_iter, n=20)
```

## 利用pytorch api实现

```python
import torch
from torch import nn
from d2l import torch as d2l
```

```python
## 网络搭建
net = nn.Sequential(nn.Flatten(),
                   nn.Linear(784, 256),
                   nn.ReLU(),
                   nn.Linear(256, 10))

## 初始化权重
def init_weights(m):
    if type(m)==nn.Linear:
        nn.init.normal_(m.weight, std=0.01)
  
net.apply(init_weights);
```

```python
## 超参数设置
batch_size, lr, num_epochs = 256, 0.1, 10
## 损失函数
loss = nn.CrossEntropyLoss(reduction='none')
## 优化器
trainer = torch.optim.SGD(net.parameters(), lr=lr)
```

```python
## 加载数据（dataloader）
train_iter, test_iter = d2l.load_data_fashion_mnist(batch_size)
## 正式训练
d2l.train_ch3(net, train_iter, test_iter, loss, num_epochs, trainer)
```

## 总结

深度学习代码编写步骤：

网络搭建-》初始化权重-》超参数设置-》损失函数-》优化器-》加载数据-》正式训练
