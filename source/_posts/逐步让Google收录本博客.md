---
title: 逐步让Google收录本博客
author: Jason Lee
date: 2023-06-19 09:18:30
tags: 
- seo
- 网站建设
categories:
---

## 前言

这个博客建立快满一年了，到目前为止积累了77篇文章，都是原创。建立之初以为半年之内Google会自动收录，没想到现在依旧未收录。之前有手动向Google提交过网址，但是好像是所有权验证问题失败了。这一次，我打算纪录下从开始提交到最终收录的全过程，顺便可以学到一点seo的知识。本文将持续更新。

## 第一天

登录google search console，并验证了网站所有权（DNS方式）后，有两个资源：一个是根域名jasonleehere.com，一个是二级域名blog.jasonleehere.com。然后向Google提交sitemap（之前已经安装好hexo-sitemap插件并生成好xml文件）。想要查询Google收录的网址和数量，可以在“网页索引编制”中查看：

![16871396076941687139607410.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16871396076941687139607410.png)

现在就等明天回来，看看网页是否被收录。

## 第二天

已收录，可通过在google搜索栏键入网址来找到：

![16872193526401687219352555.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16872193526401687219352555.png)

![16872195266361687219526444.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16872195266361687219526444.png)

前五个结果都是我的网站里的内容。但是，如果直接搜索jasonleehere或者blog jasonleehere是不会显示的，因为有其他来源的网页占据，一直到了第五页才有我。

这样就是成功了，后续就是看看google search console里的数据分析，看看有没有人通过google点进我的网站。

## 第三天

效果栏里开始有数据了。

![16873078462601687307845321.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16873078462601687307845321.png)

## 第四天

非常幸运地，第四天就有了网页索引报告。可以看出，第一批收录了10个网页，其余大部分网页处在看见了但暂时未收录的状态。

![16873931464181687393145504.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16873931464181687393145504.png)