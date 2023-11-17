---
title: namesilo购买域名和github pages配置
date: 2023-02-04 18:27:15
tags: 网站建设
categories:
---

自从建立网站以来，每次访问，都困扰于输入长长的域名前缀 www，此外，goldspot 似乎也太长且拗口。坑爹的是，goldspot 绑定的 namesilo 账号不知为什么登不上去了。索性重开新号，购买新域名。

购买域名的过程不再赘述，这次花了人民币 16.90 元。为了将买到的 rula.life 和 li199-code.github.io 绑定，需要如下操作：

首先，在 github 的仓库设置里，输入 custom domain 并保存。注意要带上 www。然后将 hexo 本地博客源文件夹的 source 文件夹下的 CNAME 记录修改如下：

```
rula.life
```

不带 http 和 www。最后，在 namesilo 的 DNS 设置界面，选择 github 模板，一键应用。回到 github pages，设置 enforce https，完毕！

注意：在 pages 设置界面，DNS 检查时，要出现如下显示，才说明 CNAME 和 Namesilo 设置成功：

![TLS](https://s3.bmp.ovh/imgs/2023/02/25/1d4916ce3a079d2d.png)
