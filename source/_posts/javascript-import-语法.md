---
title: javascript import 语法
date: 2023-02-02 15:20:42
tags:
  - javascript
  - es6
categories:
---
对于前端项目中广泛存在的 import 一直有许多疑问：为什么有的加花括号？为什么有的没有 from？这篇文章对 import 的各种情况做一个覆盖记录。

大部分 import 的都是 export。export 的作用就是暴露给外部模块，哪些可以导出。

```
// module1.js
let v = 1;
let foo = function(){
}

export {
  v,
  foo,
}
```

然后再别的模块导入 `import * from './module1.js'`。打印出来，格式是一个对象，对象的属性和方法就是 v,foo。如果只要部分到处呢？就要用花括号（解析操作符）:`export {foo} from './module1.js`.

为什么还要有 export default 呢？因为要给导出对象添加 default 属性。比如：

```
export default {
  foo
}
```

对应的导入代码：`import d from './module1.js` 。这就把 default 属性单独取出来，并取名为 d 使用。但是，default 是不能用于 `import {default} from './module1.js` .因为，default 是关键字。

最后，import不导入对象，只导入文件时，视为直接执行一遍文件：

```
import './init.js'
```
