---
title: wey项目的改造
author: Jason Lee
date: 2023-07-16 22:22:21
tags: 
categories: 全栈项目wey
---

## 前言

最近根据油管上提供的[全栈路线示意图](https://drive.google.com/file/d/1V3xa8aArTpjch8_HJe4ceU-UDI2LPXgr/view?usp=drive_link), 同时对自己的开发对象进行了总结（即全栈做小微型应用），结合知乎上的回答，对wey项目进行改造，使得学过的东西能用上，且更好地贴近实际生产场景。

## 改什么

### 数据库

数据库自然是第一重要的。现在的项目是装在docker容器中的mysql，我打算：

1. 引入redis缓存数据库。
2. 使用云数据库，而不是现在的docker容器。
3. 用oss存图片、日志等。

### 其他

trends和peopleumayknow两个脚本文件的定时执行