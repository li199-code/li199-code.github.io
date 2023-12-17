---
title: es6重要特性
date: 2023-12-16 21:12:33
updated: 2023-12-16 21:12:33
tags: ES6
categories:
---

### 前言

语言学习看文档是非常无聊的，所以找来[视频](https://www.youtube.com/watch?v=nZ1DMMsyVyI&ab_channel=freeCodeCamp.org)来学，并做了笔记。

### 模板语法

当返回一串比较复杂的字符串时，优先使用模板语法：
```javascript
`${var1}, ${var2}`
```

优点：模板所见即所得，即不需要敲换行、空格等占位符。

### 解构和扩展运算符

一切可迭代的数据类型（数组、对象等）都可以解构。解构出的是子元素。扩展运算府（三个点）也是将子元素拿出来放到一个新数据里。他们两个容易弄混：
```javascript
解构：
let income = [10, 20, 30];
let [a,b,c]=income //a=10,b=20,c=30

扩展运算符：
let x=[...income] //x=[10,20,30]
```

看出差别了吧，解构是为了把数据取出来赋值给分散的新变量，而扩展运算符是把数据取出来包裹起来作为整体赋给一个变量。

### 对象字面量

如果对象的属性是从之前声明的变量获得的，那么在创建变量时，可以直接用变量来进行声明，而不需要写完整的键值对：
```javascript
let name, age
name='jason',
age=18
let user = {
    name,
    age
}
```

### 剩余操作符


"Rest operator" 可以翻译为 "剩余操作符" 或者 "剩余参数"。在 JavaScript 中，这个概念指的是使用三个点符号（...）来收集函数中的剩余参数，将它们组合成一个数组。

举个例子，假设有一个函数用来计算总和：
```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4)); // 输出 10
```

### let const

let/const一直是ES6经久不衰的一个重要知识点。首先必须要知道，他俩为什么要发明出来取代var。因为var有一个让人非常不爽的特点：变量提升。这是一个十分臭名昭著的特性，给JavaScript代码带来了很多bug。所以let、const被提出，他俩就非常老实，只在自己的块级作用域内生效。也许javascript一开始就本该如此，谁知道创始人发了什么疯呢。

### export import

见之前博文：[javascript 模块系统](https://blog.jasonleehere.com/javascript-import-%E8%AF%AD%E6%B3%95.html)

### Class

待补充

### async/await promise

见之前博文：[同步异步任务在javascript中的实现](https://blog.jasonleehere.com/%E5%90%8C%E6%AD%A5%E5%BC%82%E6%AD%A5%E4%BB%BB%E5%8A%A1%E5%9C%A8javascript%E4%B8%AD%E7%9A%84%E5%AE%9E%E7%8E%B0.html)


