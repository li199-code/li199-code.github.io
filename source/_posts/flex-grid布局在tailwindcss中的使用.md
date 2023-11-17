---
title: flex/grid布局在tailwindcss中的使用
author: Jason Lee
date: 2023-05-03 09:13:46
tags: 
- css
- tailwindcss
categories:
---

## 前言

tailwindcss使得不用离开html界面就可以完成css coding。常见的样式多写几次自然就记住了，如果不会的，还可以查文档，但是遇到布局相关的flex和grid，需要一定的知识。

## flex

在[菜鸟教程](https://www.runoob.com/w3cnote/flex-grammar.html)的基础上，做一点总结。

基本组成，flex container和flex item。他们可以分别设置属性。

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16830806001751683080598915.png)

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做main start，结束位置叫做main end；交叉轴的开始位置叫做cross start，结束位置叫做cross end。项目默认沿主轴排列。单个项目占据的主轴空间叫做main size，占据的交叉轴空间叫做cross size。

所以想到flex布局，应该在脑海中想起的画面是：一个容器内有两条轴，一条横轴从左到右，一条竖轴从上到下。项目也是按上述顺序排列。

### flex容器的属性

- flex-direction：决定主轴是哪一条及其方向
- flex-wrap：主轴空间不够时是否换行
- flex-flow：flex-direction和flex-flow一起设置
- justify-content：主轴的对齐方式
- align-items：交叉轴的对齐方式
- align-content：align-content属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用

这里对align-content做出一点说明。所谓的多根轴线，是指在元素较多，形成换行后，每一行元素所在的轴，而不是指主轴和交叉轴：

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16830822436551683082242968.png)

如图，每一根红线都是一个轴。也就是说，align-content定义了多行元素的整体对齐方式。作为对比，align-items的对象是当行元素：

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16830824356581683082435406.png)

换句话说，多行元素用align-content，单行元素用align-items。

### flex项目属性

去除掉不常用的order，有五个属性：

- flex-grow：当有剩余空间时，项目放大比例
- flex-shrink：空间不足时，缩小比例
- flex-basis：定义了在分配多余空间之前，项目占据的主轴空间（main size）
- flex：上述三个属性的快捷设置
- align-self：对单个项目脱离align-items的对齐方式

关键是理解剩余空间。首先空间都是针对主轴来说的。

## grid

grid适合设置多行多列的，目前我遇到的情况是，设置好几个列，还有列之间的间隔，然后确定实际的一个元素占几列，就可以完成绝大部分任务了。

## flex和grid的tailwindcss写法

### flex

```
<div class="flex 主轴对齐 交叉轴对齐 元素间距">
    ...
</div>
```

### grid
```
<div class="max-w-7xl mx-auto(居中) grid grid-cols-n gap-n">
    <div class="col-span-x">
    ...
    </div>
    <div class="col-span-n-x">
    ...
    </div>
</div>
```


