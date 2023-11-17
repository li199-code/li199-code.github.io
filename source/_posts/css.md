---
title: css从0开始
date: 2022-07-30 10:55:52
tags: css
---
### 前言

一直苦于css的内容繁多，潜意识回避。但是对于初级前端岗位，重现页面是基本功。所以，决定花几天时间，重学css。知乎上的[回答](https://www.zhihu.com/question/383581311/answer/1114218936)建议将css分为选择器、样式、盒模型、定位四个部分。那么我就按这个路线学一遍，并记录自己容易出错的地方。

<!--more-->

### 选择器

id，类自不必说。

- 分组/后代/子元素区别

```css
h1, h2{} /*分组*/
h1 h2{} /*后代*/
h1>h2{} /*子元素*/
```

- 兄弟选择器

```css
h1+h2 {} /*兄弟选择器有两种，这种是相邻兄弟选择器，只选择到了h2*/
h1~h2 {} /*通用兄弟选择器，选择h1所有的兄弟h2*/
```

- 属性选择器

```css
a[href] {} /*模仿了其他语言对象属性的表达方式，选择有href属性的a标签*/
```

- 伪类选择器

```css
a:link {} /*语法特点：单个冒号，后面表示标签的状态。常见的：p:first-child, nth-child(n)*/
```

- 伪元素选择器

```css
div::before{} /*指定元素的某一部分，一共5种伪元素选择器*/


选择器	例子	例子描述
::after	p::after	在每个 <p> 元素之后插入内容。
::before	p::before	在每个 <p> 元素之前插入内容。
::first-letter	p::first-letter	选择每个 <p> 元素的首字母。
::first-line	p::first-line	选择每个 <p> 元素的首行。
::selection	p::selection	选择用户选择的元素部分。
```

- 一个大坑

```css
.class1.class2 同时属于两类的元素
.class1 .class2 属于class1的元素的后代里，属于class2的
```

- 总结
  没什么，背住！

### 样式

这部分一般面试不问，使用时查找即可。

- background
  一种是颜色背景，一种是图片背景。后者需要设置一些属性，写法上应该都采取简写：

```
body {
  background: #ffffff url("tree.png") no-repeat right top;
}
```

- text
文本对齐
```css
text-align:left\right\justify
vertical-align:top\middle\button
```
- line-height 一张图说明
<img src="https://img1.imgtp.com/2022/07/31/caYaV0yT.png">

- 一些坑

要实现文本的水平垂直居中对齐，可以分别设置
```css
text-align:center;
line-height://box height
```



### 盒模型

面试重点！应该牢牢掌握。

- padding
  内边距，空白透明，只能设置长度。顺便记录一下非常重要的浏览器长度单位：
  可分为绝对单位和相对单位，
  绝对：

  - px. 最基础的
  - in\cm\mm 计算机中都会转成px。

  相对：
  - em: 相对于父元素字体大小的倍数, 百分号也是基于父元素
  - rem: 相对于根节点html(16px).rem用的更多，因为它不需要层层换算。
  - vw/vh：基于可视区域，1vw=可视区宽度的1%

- border
  牵涉到上下左右的问题，出于简便的考虑，应该采用简写形式。

```css
p {
  border: 5px solid red; /**如果要设置某一侧边框的样式，应该写border-left: xxxx */
} 
```

- margin
margin和padding书写方式很像，但是操蛋的是auto。auto表示自动计算应得的空间。所以可以实现居中操作。

### 定位
最复杂和让人蛋疼的部分。

- position
 要想让元素移动，除了要设置position, 还要设置top\left等数值
  ```css
  position:relative/absolute/fixed
  ```
  - relative
   相对于其原来位置移动，不脱离文档流

  - absolute
  相对于最近的**有定位**的祖先元素移动，脱离了文档流

  - 子绝父相：本质上是父元素不脱离文档流，而子元素可以在父元素内方便得改变位置

- float
  ```css
  float:left/right/none/inherit
  ```
  浮动的框可以向左或向右移动，直到它的外边缘碰到包含框或另一个浮动框的边框为止。
  由于浮动框不在文档的普通流中，所以文档的普通流中的块框表现得就像浮动框不存在一样。

- flexbox
flex 比float+position组合好用多了。

先写到这里吧，flex另开一个新坑。



