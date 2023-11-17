---
title: laravel 入门笔记
date: 2023-02-10 10:48:57
tags:
  - laravel
  - php
categories:
---

laravel 是目前最流行的 php 框架。本文从创建一个 laravel 项目开始说起，对接触到的一些名词做一个记录。

## 创建 laravel 项目

php 在最近的几个版本中，都内置了简单的服务器（类比于 nodejs）。前阵子学习基础语法的时候，一直借助 wamp 等集成环境。看似方便，但是配置起来还是麻烦。现在学习 laravel，启动后调用的是 php 内置服务器，数据库可以选择 mysql 或者 sqlite。

composer 是 php 的依赖管理器（类比于 npm）。composer 安装过程中，会指定 php.exe 所在位置。安装完后，输入下列命令创建 laravel 项目：

```
composer create-project laravel/laravel example-app
```

项目文件夹下，有 `composer.json`（类比 `package.json`）和 vendor 文件夹（类比 `node_modules`）。

令人惊喜的是，laravel 集成了 vite 框架，可以实现前端页面的热更新。

创建好项目后，`php artisan serve`启动项目。`php artisan ...`就是 composer 提供的指令集。

配置文件在 `env`文件和 congfig 文件夹下。
