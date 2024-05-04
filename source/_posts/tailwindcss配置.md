---
title: tailwindcss配置
author: Jason Lee
date: 2023-04-27 16:50:53
tags: tailwindcss
categories:
---

## 前言

一个准备实现的 django 项目中用到了 tailwindcss。年初我曾接触过 tcss，但是由于文档对我来说有点看不懂，配置了很久还是失败了，所以搁置了下来。今天，经过良久的尝试，将成功的经验记录下来。

## cdn

cdn 是最快尝试 tcss 的方法。它是通过在线引入 tcss 的 stylesheet 来实现的。

```
<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
```

通过 CDN 引入的显著缺点是，每一次更改样式都要请求网络，如果网络不好或者断网，就会带来不好的开发体验。官网文档还给出了一些缺点：

![](https://cdn.jsdelivr.us/gh/li199-code/blog-imgs@main/16825858863281682585886085.png)

## Tailwind CLI

利用脚手架工具，可以生成一个定制的 css 文件，里面预定义了一大堆样式，比如 mt-5 等，正是我们在 html 文件中用到的 tcss 类名。不仅可以离线开发，而且可以添加自定义样式。操作方式如下：

首先，创建一个`/src/tcss.css`：

```
@tailwind base;
@tailwind components;
@tailwind utilities;

<!-- your style -->
@layer components {
  .btn-blue {
    @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;
  }
}
```

可以看出，tcss 有三个层次，base 层起到清除浏览器的初始默认样式，比如一些 margin 和 padding。components 负责将一些重复使用的样式组提取出来，单独取一个名字，比如上面代码的 btn-blue。最后是 utilities，就是最熟悉的 tcss 自带类，也可以自定义。

创建好上面的源 tcss 文件后，进行解析：

```
npx tailwindcss-cli build src/tailwind.css -o tailwind.css
```

上述命令竟然是我从别的教学视频里得到的，官方文档给出的命令只能得到 500 多行的解析文件，只包含了 base 层。不得不说，tcss 文档写的很烂。正常来说，上面命令运行后生成的文件含有 18 多万行代码。

在 index.html 中，header 部分引入生成的`tailwind.css`:

```
<link href="/tailwind.css" rel="stylesheet">
```

可以开始愉快地使用 tcss 了。
