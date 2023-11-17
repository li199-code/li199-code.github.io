---
title: 同步异步任务在javascript中的实现
author: Jason Lee
date: 2023-08-07 14:45:51
tags:
categories:
---

## 前言

同步异步一直是一个绕不过去的小问题，要么遇不上，要么遇上了似懂非懂。这篇文章力争从异步任务的底层需求出发，对 promise、async/await 进行一个详细的了解。

## 同步 or 异步？

![16913918214981691391820745.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16913918214981691391820745.png)

上面这张图表示了两种模式的执行顺序区别，也是最根本的区别。

chatGPT 给出的定义如下：

异步任务是指在程序执行过程中，不会阻塞后续代码执行的任务。它们允许在后台执行，以便在等待长时间操作（例如网络请求、文件读写或计算密集型任务）完成时，程序能够继续执行其他任务，提高了程序的响应性和效率。

一个异步函数可以拆分为两个部分，一个是耗时部分，这部分时间内执行后面的代码来防止阻塞；另一个是回调函数部分，当耗时部分产生结果后，调用回调函数。

**一句话总结：异步任务是让代码不会阻塞，而 promise 和 async/await 都是为了让异步任务的代码更易懂。**

接下来看看 promise 和 async/await 是怎么让异步代码更易懂的？

## promise 是一种容器

上面说了异步任务的耗时部分结束后，要执行回调函数；如果这时候回调函数的执行结果要作为下一个异步任务的输入，那么就会有多个缩进，使得代码难以读懂，比如：

```
getUserInfo(function(userInfo) {
    getUserOrders(userInfo.id, function(orders) {
        orders.forEach(function(order) {
            getOrderDetails(order.id, function(details) {
                console.log("Order ID: " + order.id);
                console.log("Order Details: " + details);
            });
        });
    });
});
```

假设我们要依次执行三个异步操作：获取用户信息、获取用户订单列表，然后获取每个订单的详细信息。在上面的代码中，每个异步操作都依赖前一个操作的结果，因此它们被嵌套在一起。这会使代码变得难以理解，增加了错误发生的可能性，而且难以进行错误处理和调试。

如果把被嵌套的函数抽出来，问题就解决了。Promise 将嵌套函数放在 then 里，并且添加了异常处理机制，即 resolve/reject。async 和 await 的原理是，async 等于一个函数的修饰符，表示函数包含异步操作。而 await 后面的执行语句应返回一个 promise 对象，否则 vscode 会提示（非报错）：'await' has no effect on the type of this expression.
