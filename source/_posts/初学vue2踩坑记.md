---
title: 初学vue2踩坑记
date: 2022-08-01 11:03:20
tags: vue
---

跟着 b 站黑马程序员的视频入门 vue，跟敲代码过程中，踩到一些坑，在这里记录一下：

- 定义方法时，是`methods`而不是`method`
<!--more-->

- `{{}}`叫做插值表达式

- 写计数器案例时用到了 flex,发现下面这种换行不是 flex 认可的换行，`align-content`无效：

```html
<span>{{num}}</br>{{num}}</span>
```

- v-bind
  bind,绑定的意思，就是给元素绑定属性。首先，用简写形式`:[name]="content"`。然后绑定类名属性`class`时，最简单的写法是，`:class="{[name]:isActive}"`,也就是切换类。
  v-for 有一个性能优化问题。实时绑定的数据，在数据量大的情况下，计算复杂大，所以，vue 在使用了 v-for 的标签里添加了一个 key 属性，并将其用 v-bind 绑定，属性值应该是一个不重复的值，在数据更新时，判断是否时新的 key, 然后渲染。不宜用索引值，因为在数组中间插入时，很多数据的 key 会更新。

- v-model
  双向绑定**表单元素**的值。那么常见的表单元素及其值有哪些呢？

> 你可以用 v-model 指令在表单 `<input>`、`<textarea>` 及 `<select>` 元素上创建双向数据绑定。

[官网文档](https://cn.vuejs.org/v2/guide/forms.html)上的举得例子挺多，感觉这里是比较容易犯错的。

- `<input type=''>`

顺便复习一下 input 表单元素。看到以下类型能想起他们作用和浏览器中的样式即可。
`text/password/radio/checkbox/button`

---

下面是做视频中的项目时遇到问题的记录

- 如何将输入框的内容双向绑定？

原以为`input`需要声明一个值作为输入内容，实际上 v-model 自己就可以将输入值和`data`中的变量绑定。所以应该先创建`data`中的变量，然后绑定。

- 悬浮在 item 时，显示删除符合的 css

原本想的是先用行内样式将删除模块设为`display:none`。后来发现不起效。原因是行内样式的优先级最高，`<style>`标签里的 css 会被覆盖。所以把上述代码放到了`<style>`里，成功。

- 如何设置主体高度随条目数量增大而增大，并在超过某一限度时设置滚动

直接上代码：

```css
.items {
  max-height: 420px;
  overflow: auto;
}
```

附上`overflow`中 scroll 和 auto 属性的区别：

> 二者都会在内容超出范围时显示滚动条，但在元素没有超出时，auto 会隐藏滚动条，scroll 依旧显示滚动条，但是禁用该滚动条。

---

一起记录下 vuecli 的入门学习过程。

- babel:将 es 较新版本的规则编译成较低的，来让浏览器运行

- `npm run serve`后，生成的两个地址中，有一个网络地址，可以通过其他在同一局域网下的设备访问

- `package.json`中，`script`下包含了项目的启动方式。除了`start`外，都要写成`npm run ...`的形式。

- 开发环境和生产环境：开发环境包含了很多库，还要`.vue`后缀文件，不能被浏览器解析。所以，执行 webpack（vuecli 自带）打包，`npm run build`命令后，变成 html\css\js 的生成环境。

- `.gitignore`说明了哪些文件在 git 上传中被忽略

- 在`.vue`文件中的`<template>`标签下。只能用一个 html 根标签。一个组件就包含了 html\js\css.

- `main.js`和 vue 组件里的 js 代码什么关系？
  `index.html`直接执行的 js 文件只有`main.js`,而`main.js`导入了其他组件编写的 js 代码的接口。

- 组件注册分为全局（很少用）和局部。局部组件三步走：引入+注册+使用。注册完毕后，就可以将整个组件以 html 标签的形式插入到 app.vue 中。

- `style`标签里面添加`scoped`可以令样式只作用于当前组件，是通过为组件标签添加 hash 值属性实现的。

- `slot`是什么？用于组件之间的嵌套。在组件 a 标签内部，插入组件 b 标签，并在组件 b 标签中添加 slot 属性及 id。然后在组件 a 内添加`<slot>`标签，name 属性是 id。即可实现精确的占位。

package.json 里面的 devDependencies 和 dependencies 分别是什么？

<table>
<thead>
<tr>
<th>配置项</th>
<th>命令</th>
<th>描述</th>
</tr>
</thead>
<tbody>
<tr>
<td>devDependencies</td>
<td>--save-dev 简写 -D</td>
<td>开发环境，管理的依赖包仅在开发阶段有效</td>
</tr>
<tr>
<td>dependencies</td>
<td>--save 简写  -S</td>
<td>生产环境，管理的依赖包在项目上线后依然有效</td>
</tr>
</tbody>
</table>
