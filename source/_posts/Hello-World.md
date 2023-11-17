---
title: Hello World!
date: 2022-07-26 09:41:37
tags: 网站建设
---

## 记录一下本网站的建立过程

首先，本网站是一个静态博客，基于 GitHub pages 提供的免费服务器，域名在 Namesilo 上购买，页面管理器为基于 nodejs 的 hexo, 总花费￥ 6.72/year. 建站第一天，感觉访问速度还可以。因为在国外买的域名，还不用备案，很爽，all for freedom.

日常管理上，需要发布新文章时，在 Git Bash 上执行下列流程：

```shell
    hexo new "title"
    hexo g
    hexo s
    hexo d
```

如果后期网站外观固定下来，维护起来还是很省心的，nice。
