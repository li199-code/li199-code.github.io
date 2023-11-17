---
title: djangoBlog学习记录5 - 日志
date: 2022-12-15 16:00:48
tags:
categories: djangoBlog
---

### 日志

ModelAdmin本身就有日志记录功能。当新建一个实体(Post、Category、Tag)时,ModelAdmin会创建一条变更日志记录。当修改一条内容时，ModelAdmin又会调用LogEntry来创建一条日志，记录这个变更。

https://www.cnblogs.com/lookingforfreedom/p/15717729.html
