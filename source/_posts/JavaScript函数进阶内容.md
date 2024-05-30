---
title: JavaScript函数进阶内容
tags: javascript
abbrlink: b7e39eaf
date: 2023-12-22 14:31:38
updated: 2023-12-22 14:31:38
categories:
---

## 前言

根据在线书籍的[函数进阶内容](https://zh.javascript.info/)部分整理而来。

## 递归

递归是指函数内部调用自身。递归是一种编程模式，在一个任务可以自然地拆分成多个相同类型但更简单的任务的情况下非常有用。通常递归更简洁、代码量更少，有时候比循环快（不一定！），但是一定比循环消耗更多空间。当一个问题写成循环需要三层 for 循环及以上，甚至是不知道具体深度的时候，可以考虑递归写法。

具体应用而言，递归可以遍历结构复杂的数据，比如 json。下面给出一个例子：

```json
let company = {
  sales: [{
    name: 'John',
    salary: 1000
  }, {
    name: 'Alice',
    salary: 1600
  }],

  development: {
    sites: [{
      name: 'Peter',
      salary: 2000
    }, {
      name: 'Alex',
      salary: 1800
    }],

    internals: [{
      name: 'Jack',
      salary: 1300
    }]
  }
};
```

递归解决方案：

```javascript
// 用来完成任务的函数
function sumSalaries(department) {
  if (Array.isArray(department)) {
    // 情况（1）
    return department.reduce((prev, current) => prev + current.salary, 0); // 求数组的和
  } else {
    // 情况（2）
    let sum = 0;
    for (let subdep of Object.values(department)) {
      sum += sumSalaries(subdep); // 递归调用所有子部门，对结果求和
    }
    return sum;
  }
}

alert(sumSalaries(company)); // 7700
```
