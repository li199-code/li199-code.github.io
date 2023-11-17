---
title: pytorch的基本使用
date: 2023-03-28 16:43:29
tags: deep-learning
categories: 动手pytorch
---
之前我们有大量的从零实现一层网络，现在借用先进的pytorch框架，让很多功能得到封装，可以快捷的组建一个块。

## nn.Module

nn.Module是pytorch一切网络的祖宗。例如，可以用nn.Sequential()搭建，也可以新写一个类：

```
class net(nn.Module):
   def __init__(self):
	super.__init__()
	...

   def forward(self, x):
	...
```

nn.Sequential和net类都是继承于nn.Module。

## 参数管理

参数的访问用state_dict()函数：

```
print(net[2].state_dict())
```

```
OrderedDict([('weight', tensor([[ 0.3016, -0.1901, -0.1991, -0.1220,  0.1121, -0.1424, -0.3060,  0.3400]])), ('bias', tensor([-0.0291]))])
```

每一种参数（比如weight）都是一个类，下面包含数值，梯度等属性。比如：

```
net[2].weight.data, net[2].weight.grad
```

## 权重初始化

默认情况下，PyTorch会根据一个范围均匀地初始化权重和偏置矩阵， 这个范围是根据输入和输出维度计算出的。 PyTorch的 `nn.init`模块提供了多种预置初始化方法。用nn.init：

```
def init_normal(m):
    if type(m) == nn.Linear:
        nn.init.normal_(m.weight, mean=0, std=0.01)
        nn.init.zeros_(m.bias)
net.apply(init_normal)
net[0].weight.data[0], net[0].bias.data[0]
```

m就是层的意思，apply函数会将init_normal函数遍历处理所有层。上述代码将所有的全连接层权重初始化为N~(0.0.01)的高斯分布。

## 共享权重

共享权重似乎在论文中见过很多次，就是将一个子网络训练的过程中，将权重分享给另一个相同结构的子网络。这里给出的，是两个全连接层的参数共享：

```
# 我们需要给共享层一个名称，以便可以引用它的参数
shared = nn.Linear(8, 8)
net = nn.Sequential(nn.Linear(4, 8), nn.ReLU(),
                    shared, nn.ReLU(),
                    shared, nn.ReLU(),
                    nn.Linear(8, 1))
net(X)
# 检查参数是否相同
print(net[2].weight.data[0] == net[4].weight.data[0])
net[2].weight.data[0, 0] = 100
# 确保它们实际上是同一个对象，而不只是有相同的值
print(net[2].weight.data[0] == net[4].weight.data[0])
```

## 创建全新的层

有时候，可能需要创建一个pytorch未实现的层。以自定义一个linear层为例：

```
class MyLinear(nn.Module):
    def __init__(self, in_units, units):
        super().__init__()
        self.weight = nn.Parameter(torch.randn(in_units, units))
        self.bias = nn.Parameter(torch.randn(units,))
    def forward(self, X):
        linear = torch.matmul(X, self.weight.data) + self.bias.data
        return F.relu(linear)
```

核心步骤就是在init函数，设置好可以更新的权重，然后再forward函数里面定义计算方式。

## 权重的保存（checkpoint）

pytorch只能保存权重，而不能连同网络结构一起保存，不过听说tf可以。保存方式是torch.save():

假设要保存参数的对应模型是一个MLP：

```
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.hidden = nn.Linear(20, 256)
        self.output = nn.Linear(256, 10)

    def forward(self, x):
        return self.output(F.relu(self.hidden(x)))

net = MLP()
X = torch.randn(size=(2, 20))
Y = net(X)
```

```
torch.save(net.state_dict(), 'mlp.params') # 保存
```

```
net.load_state_dict(torch.load('mlp.params'))  # 加载
```

