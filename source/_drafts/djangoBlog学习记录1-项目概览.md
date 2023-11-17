---
title: djangoBlog学习记录1 - 项目概览
date: 2022-12-15 15:56:09
tags: django
categories: djangoBlog
---

## 前言

最近重拾django，打算深入学习一下，达到熟练使用框架开发的目的。这个项目的分析是在阅读django文档的intro部分后开始的，对于项目的结构已经有了一定的认知。这个系列的分析，将以个人的原创理解为主，重点学习作者的代码写法。

## 项目总体结构

installed-apps包含下面自建app：

```
'mdeditor', // python库，负责markdown支持
'haystack', // python库，负责搜索功能

6个自建apps:
'blog',    //博客相关
'accounts', //账户
'comments', //评论
'oauth',    //身份验证
'servermanager', //微信公众号管理（暂时不分析）
'owntracks', //用户位置（暂时不分析）
```

## djangoBlog folder

```
djangoblog
 ├── admin_site.py // 自定义admin后台
 ├── blog_signals.py // 一些自动执行的操作
 ├── elasticsearch_backend.py // 搜索后台
 ├── feeds.py // rss订阅
 ├── logentryadmin.py // 负责将日志添加到后台数据库中
 ├── settings.py 
 ├── sitemap.py // 网站地图，seo相关
 ├── spider_notify.py // 页面改动会通知搜索引擎，seo相关
 ├── tests.py
 ├── urls.py 
 ├── utils.py  // 通用工具组件，如发邮件，刷新视图缓存等
 ├── whoosh_cn_backend.py // 搜索相关
 ├── whoosh_index // 文件夹，搜索相关
 └── wsgi.py //Web服务器和Python Web应用程序之间的接口协议,提高程序的可移植性
```

博客系统最核心的功能：博文的维护（blog）、账号管理（account）、评论管理（comments）。所以学习的重心放在这三个子应用上。
