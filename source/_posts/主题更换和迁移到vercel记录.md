---
title: 主题更换和迁移到vercel记录
date: 2023-03-07 10:02:05
tags: 网站建设
categories:
---

首先是主题更换。之前用的主题原生很多动画和功能，但是我本身是不喜欢复杂的，所以把背景和功能改的很精简。但是这样反而做的不称心。我的理想样式是：文章居中，两侧没有除了目录外的任何东西。所以，我找到了目前用的这个 orange 主题，这次我用的时间打算长些，短时间不换了。

其次是静态网站服务器从 github-pages 转移到 vercel。主要考虑是，github-pages 要求对应的仓库必须是公开的，这样有心人可以看到每一次过往文章提交修改记录，这让我觉得有点膈应。vercel 是一种流行的无服务平台，代码托管在 github 仓库后，vercel 可以实现自动部署和发布。现在的工作流是，本地修改好文章，直接推到 github 私有仓库，vercel 检测到变化，自动部署。值得一提的是，我顺便更换了 DNS 的 nameserver，由原来 namesilo 默认的，换到全球最大的 CDN 商 cloudflare。中间的过程记录一下。

vercel 创建实例成功后，会分配一个 `example.vercel.app`的二级域名。为了将买到的域名用上，需要去自定义设置，添加域名，vercel 会给你一个 A 或者 CNAME 记录。如果是一级域名，给 A 记录；如果是二级域名，给 CNAME 记录。这时候要在 cloudflare 添加记录。首先注册 cloudflare，然后，输入自己先前购买的域名，自动导入目前的 DNS 解析记录和 nameserver。这时候，将 DNS 解析规则先删除，并来到 namesilo 的管理页面，改变 nameserver 为 cloudflare 提供的地址。到这里的修改都是实时生效的。回到 cloudflare，刷新，cloudflare 开始接管你的域名，这一过程会花费十几分钟。

然后，将之前 vercel 提供的解析记录，提供给 cloudflare。不同于 github-pages，只有输入一条就能解析了。

![](https://s3.bmp.ovh/imgs/2023/03/07/507ecae07ffccde7.png)

其中，名称就是二级域名，内容是 vercel 的地址。成功后，这是你浏览器发出的请求就会被 cloudflare 所解析啦，并且可以勾选他们家提供的 CDN 服务。据说，中国大陆的 cloudflare CDN 反而是减速器，所以我没选。设置好后，实测不用翻墙就可以访问网站。

以后就专心写文章啦！
