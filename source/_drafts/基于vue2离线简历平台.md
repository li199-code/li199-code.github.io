---
title: 基于vue2离线简历平台
tags: vue
---

#### day1 分析源代码
App.vue结构

```
resume:简历主体
guide:下面四个使用说明
actions: 保存选项
footer：作者主页链接
```

简历主体部分中，`ContextList`是一级小块，其下的`ListItemxxx`(如ListItemAbout)为二级，最小组件是`ListItem`。`ListItemxxx`不是`ContextList`的子组件。