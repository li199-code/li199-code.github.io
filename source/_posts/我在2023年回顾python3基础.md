---
title: 我在2023年回顾python3基础
author: Jason Lee
date: 2023-05-06 17:02:05
tags: python
categories:
---

## 到底什么是数字、元组、字符串的不可变性？

不可变性，指的是不能改变原有位置上的元素；不包括在空位置上创建元素。所以，元组都可以连接其他同类元素使得自己变得更长，而不能改变原来的元素。

数字、字符串的不可变性：变量赋值 a=5 后再赋值 a=10，这里实际是新生成一个 int 值对象 10，再让 a 指向它，而 5 被丢弃，不是改变 a 的值，相当于新生成了 a。字符串类似。

## 生成器和迭代器

生成器和迭代器都可以提高性能和内存效率，因为它们可以一次生成一个元素，而不必在内存中存储整个数据集。通过理解生成器和迭代器的工作原理，我们可以更有效地处理大型数据集。

假如有一个场景，我们深度学习训练时读取数据，由于训练图片很多，不可能一次性读进内存，所以采用生成器或迭代器的方式，一次读取几张图像。

生成器和迭代器实现的事情都是类似的，即一次只输出少量的数据，只是他们的**创建方式**有差异。

### 迭代器

迭代器是一种对象，它可以用于迭代序列中的元素。迭代器具有一个__next__()方法，该方法返回序列中的下一个元素，并在没有更多元素时引发StopIteration异常。

创建迭代器的方法：一个从现有序列中直接创造：`iter(seq)`，另一种需要创建一个类（由类实例化出对象），类带有`__iter__`和`__next__`方法：

```
class FibonacciIterator:
    def __init__(self):
        self.a = 0
        self.b = 1
    
    def __iter__(self):
        return self
    
    def __next__(self):
        result = self.b
        self.a, self.b = self.b, self.a + self.b
        return result

fib_iter = FibonacciIterator()
for i in range(10):
    print(next(fib_iter)) 
## 另外一种调用方式
for value in fib_iter:
    print(value)
```

### 生成器

生成器是一种特殊的函数，它使用yield关键字来产生一个值，并暂停函数的执行。每次调用生成器函数时，它都会从上一次停止的位置继续执行，直到遇到yield语句。生成器是一种简单而强大的工具，可以在处理大型数据集时提高性能和内存效率。

```
def fibonacci():
    a, b = 0, 1
    while True:
        yield b
        a, b = b, a + b

f = fibonacci()
for i in range(10):
    print(next(f))
## 也可以：
for value in f:
    print(value)
```

可以看出，生成器在这个例子中会简短一些。同时可以看出，调用的时候，生成器和迭代器的两种方式都一样，分别是固定次数（可能会超出边界而引发StopIteration异常，以及forin循环。创建时的不同是：生成器是一个函数，而迭代器是一个对象。

## 不定长参数

不定长参数就是那种在定义函数或者方法时，括号里的参数带一个或者两个星星的。一个星星被放入元组，实参不带参数关键字；两个星星被放入字典，实参带关键字，关键字被当作字典的键名。

```
def printinfo( arg1, *vartuple, **vardict ):
   "打印任何传入的参数"
   print ("输出: ")
   print (arg1)
   print(vartuple)
   print(vardict)

printinfo( 70, 6, a=60, b=50)

out:

输出: 
70
(6,)
{'a': 60, 'b': 50}
```

## 异常处理

raise 抛出异常，程序把异常打印出来（抛给用户），并停止后续代码的运行。如果没有raise，程序将继续运行。