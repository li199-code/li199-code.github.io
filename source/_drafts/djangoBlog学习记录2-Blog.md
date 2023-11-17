---
title: djangoBlog学习记录2 - Blog
date: 2022-12-15 15:57:39
tags:
categories: djangoBlog
---

```
blog
 ├── admin.py // 将blog app建立的模型注册到admin中
 ├── apps.py // django app的基本配置，直接继承django源代码
 ├── context_processors.py // 全局变量处理器，方便模板直接使用
 ├── documents.py // 搜索相关
 ├── forms.py 
 ├── management // 文件夹，自定义命令集合
 ├── middleware.py // 自定义中间件
 ├── migrations
 ├── models.py 
 ├── search_indexes.py // 搜索相关
 ├── static // 静态文件夹
 ├── templatetags // blog_tags.py是自定义标签，用于模板
 ├── tests.py
 ├── urls.py
 └── views.py
```
