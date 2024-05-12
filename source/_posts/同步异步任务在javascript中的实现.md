---
title: 同步异步任务在javascript中的实现
author: Jason Lee
tags: 异步编程
categories: JavaScript异步编程
abbrlink: c8c3d6c5
date: 2023-08-07 14:45:51
---

## 前言

同步异步一直是一个绕不过去的小问题，要么遇不上，要么遇上了似懂非懂。这篇文章力争从异步任务的底层需求出发，对 promise、async/await 进行一个详细的了解。

## 同步 or 异步？

![16913918214981691391820745.png](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/16913918214981691391820745.png)

上面这张图表示了两种模式的执行顺序区别，也是最根本的区别。

chatGPT 给出的定义如下：

> 异步任务是指在程序执行过程中，不会阻塞后续代码执行的任务。它们允许在后台执行，以便在等待长时间操作（例如网络请求、文件读写或计算密集型任务）完成时，程序能够继续执行其他任务，提高了程序的响应性和效率。
> 一个异步函数可以拆分为两个部分，一个是耗时部分，这部分时间内执行后面的代码来防止阻塞；另一个是回调函数部分，当耗时部分产生结果后，调用回调函数。

解释完了同步和异步的差异以及异步的优势，下面说一下这篇文章要讨论的核心：假如目的是多个异步任务按顺序执行，应该如何书写易懂的代码？

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

假设我们要依次执行三个异步操作：获取用户信息、获取用户订单列表，然后获取每个订单的详细信息。在上面的代码中，每个异步操作都依赖前一个操作的结果，因此它们被嵌套在一起。这会使代码变得难以理解。面对这样的嵌套回调，处理错误也会变得非常困难：你必须在“金字塔”的每一级处理错误，而不是在最高一级一次完成错误处理。

所以，现在的目标是：

1. 减少嵌套，使得代码方便阅读和调试
2. 在最高一级一次性处理错误

**一句话总结：异步任务是让代码不会阻塞，而 promise 和 async/await 都是为了让多个异步任务按顺序执行的代码更易懂。**

接下来看看 promise 和 async/await 是怎么让异步代码更易懂的？

## promise 是一种容器

如果把被嵌套的函数抽出来，问题就解决了。Promise 将嵌套函数放在 then 里，并且添加了异常处理机制，即 resolve/reject。async 和 await 的原理是，async 等于一个函数的修饰符，表示函数包含异步操作。而 await 后面的执行语句应返回一个 promise 对象，否则 vscode 会提示（非报错）：'await' has no effect on the type of this expression.

## 更新

如果说 async、await 是为了保证异步任务串行执行顺序正确，那么似乎违反了异步任务的根本好处：不阻塞代码。我被这个问题困扰了一会儿，但实际上这大概是这种方便的写法带给我们的错觉。下面举个例子说明。

当使用`await`等待一个 Promise 完成时，它会暂停当前函数的执行，但不会阻塞整个程序的执行。其他的事件和任务仍然可以被处理。

让我用一个更清楚的例子来说明。假设我们有一个异步函数`fetchData`，它会模拟一个异步的数据请求，并返回一个 Promise。

```javascript
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchData() {
  console.log("Start fetching data");

  await delay(2000); // 等待2秒钟模拟数据请求

  console.log("Data fetched");

  return "Data";
}

console.log("Before fetchData");
fetchData().then((data) => console.log("Received data:", data));
console.log("After fetchData");
```

在这个例子中，我们调用了`fetchData`函数，它会等待 2 秒钟模拟一个数据请求。在等待期间，JavaScript 引擎可以执行其他任务。

当我们运行这段代码时，输出将会是：

```
Before fetchData
Start fetching data
After fetchData
Data fetched
Received data: Data
```

我们可以看到，在调用`fetchData`函数时，它会立即返回一个 Promise，并输出`Before fetchData`和`Start fetching data`。然后，`await delay(2000)`会暂停函数的执行，但不会阻塞整个程序。

在这段等待期间，JavaScript 引擎继续执行后续的代码，输出`After fetchData`。当 2 秒钟过去后，`await`表达式恢复执行，输出`Data fetched`。最后，通过`.then`方法获取到数据并输出`Received data: Data`。

这个例子展示了`await`的非阻塞特性。虽然函数的执行被暂停了，但整个程序的执行仍然继续，其他任务可以被执行。这使得 JavaScript 能够以非阻塞的方式处理异步操作，提高程序的性能和响应性。

所以，阻塞的部分仅仅是 async 修饰的函数内部，而不是整个程序。到这里，我也明白了 async 修饰符的意义，那就是告诉浏览器或者 nodejs，这部分代码必须要按照顺序串行执行。

## 更新 2

async 函数本质上还是一个返回 promise 容器的函数。async 的作用，是把 promise 仍稍显古怪的 then().then()这种‘一连串’写法，改成了跟同步一样的写法。即 await 来代替 then。同时，更新 1 的例子中，fetchData()后面还能跟一个.then()，说明了 async 最终还是返回了一个 promise 容器。

async 就像一个大的 promise，装了小的 promise。
