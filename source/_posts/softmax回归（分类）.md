---
title: softmax回归（分类）
date: 2023-03-23 10:20:57
tags: deep-learning
categories: 动手pytorch
---
## 回归和分类

机器学习（深度学习）的任务纷繁复杂。最基础的是回归和分类。回归是预测连续值，分类是预测离散类别。

分类问题是多输出，因此，训练标签和模型（网络）的输出应该是多维的。*独热编码* （one-hot encoding）是一种表示多分类的方式。就是在一个向量中，将真实分类索引下的值设为1，其他是0，因此向量自身的内积为1。另外，模型的线性表示为：

所以，softmax也是一个单层全连接网络。

\begin{aligned}
o_1 &= x_1 w_{11} + x_2 w_{12} + x_3 w_{13} + x_4 w_{14} + b_1,\\
o_2 &= x_1 w_{21} + x_2 w_{22} + x_3 w_{23} + x_4 w_{24} + b_2,\\
o_3 &= x_1 w_{31} + x_2 w_{32} + x_3 w_{33} + x_4 w_{34} + b_3.
\end{aligned}

## softmax函数

分类问题的训练，可以用最大化正确分类的概率来表示。因此，要通过softmax函数将神经网络的输出$o_i$转化为0-1之间的概率。

\begin{equation}
\hat{\mathbf{y}} = \mathrm{softmax}(\mathbf{o})\quad \text{其中}\quad \hat{y}_j = \frac{\exp(o_j)}{\sum_k \exp(o_k)}
\end{equation}

softmax可以保证输出在0-1之间，且softmax可导。
