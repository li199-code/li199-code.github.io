---
title: npm 如何管理项目？
date: 2023-01-30 22:38:05
tags: npm
categories:
---

npm，从开始动手做前端项目起，就一直陪伴。一个既熟悉又陌生的老朋友。平时，需要什么包，或者启动项目，是最常见的使用场景。但是，出现 bug，往往只是撞大运式地搜索、debug。这篇笔记记下一些以前未注意到的 npm 知识点。

## npm install

`npm install express --save` == `npm install express`. save 是指将安装的包更新到 `package.json`的 dependency 中.也就是说，不加参数 save，肯定是默认更新的。

`npm install express --save-dev`是将改动更新到 devdependency 中。
