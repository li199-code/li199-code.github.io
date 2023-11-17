---
title: 'wey: 基于vue+django的社交网站(0)'
author: Jason Lee
date: 2023-06-22 20:49:39
tags: 
categories: 全栈项目wey
---

## 前言

这个项目我是跟随youtube上的博主[视频教程](https://www.youtube.com/watch?v=xOxN_7coIDw&list=PLpyspNLjzwBlobEvnZzyWP8I-ORQcq4IO&ab_channel=CodeWithStein)做的。大概是从五月初开始的，持续了三个星期左右。这个项目对我来说有着非凡的意义，因为能将它完成说明自己具备了设计一个网站和部署上线的能力，而且用上了我目前最喜欢的技术栈：vuejs+django。写这篇博客时，它还处于一个比较难用的阶段，很多功能还没有添加，我打算在记录的过程中逐步添加这些功能。

<!-- 这将会是一个系列，包含：

1. 本文对技术栈工作流的总结，方便在很长一段时间不开发后能快速启动一个最舒适的开发环境。以及待办列表，记录要添加的功能
2. 前端篇
3. 后端篇
4. 部署篇 -->

[项目github链接](https://github.com/li199-code/wey)。


## 工作流

写前端代码的编辑器为vscode，插件组合为Tailwind CSS IntelliSense+Volar。后端代码用pycharm，python的环境管理参照我之前写的[博文](https://blog.jasonleehere.com/2023/06/21/wo-de-python-kai-fa-huan-jing-guan-li-shi-jian/)。很不幸的是，自己创建项目时没有引入git进行代码管理。然后我现在已经加上了git。

资源网站：

- [heroicon](https://heroicons.com/)(下载icon，免登录）
- [tailwindcss cheatsheet](https://tailwindcomponents.com/cheatsheet/)(忘记样式写法时的速查表）
- chatgpt(问问题很好用）
- [django docs](https://docs.djangoproject.com/zh-hans/4.2/intro/)（少有的高质量中文文档）

## 完成记录

- day1: 将数据库更换为mysql，并用docker部署运行。暂时删除了注册账户时发送邮件的功能。批量生成post和comment的伪数据。
- day2: 实现了帖子和评论的分页。管理后台界面用了django-admin-grappeli插件进行美化（其实差不多）。修复了edit profile 无法显示头像上传框的问题。登录逻辑由原来的双token改为单token。
- day3: 整理了生产环境和开发环境配置文件，并在生产环境（云主机+docker)调试上线。
