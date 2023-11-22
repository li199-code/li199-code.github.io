---
title: nodejs 模块系统
date: 2023-02-02 15:20:42
tags:
  - nodejs
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

最后，import 不导入对象，只导入文件时，视为直接执行一遍文件：

```
import './init.js'
```

## 更新

### export 和 export default 区别

在 Node.js 中，`export`和`export default`是用于导出模块的关键字。它们的主要区别如下：

1. `export`关键字：

   - `export`关键字用于导出模块中的一个或多个成员（变量、函数、类等）。
   - 使用`export`关键字时，需要使用具体的标识符来导出。
   - 可以使用命名导出（Named exports）或默认导出（Default export）。

2. `export default`关键字：
   - `export default`关键字用于导出模块的默认成员。
   - 一个模块只能有一个默认导出。
   - 导入该模块时，可以选择为默认导出指定任意名称。
   - 默认导出可以在导入时使用任意名称，使得在导入时不需要知道导出成员的具体名称。

下面是一些示例来说明两者之间的区别：

使用`export`关键字导出模块成员：

```javascript
// module.js
export const name = "John";
export function greet() {
  console.log("Hello!");
}

// app.js
import { name, greet } from "./module.js";
console.log(name); // 输出: John
greet(); // 输出: Hello!
```

使用`export default`关键字导出默认成员：

```javascript
// module.js
const name = "John";
function greet() {
  console.log("Hello!");
}
export default {
  name,
  greet,
};

// app.js
import myModule from "./module.js";
console.log(myModule.name); // 输出: John
myModule.greet(); // 输出: Hello!
```

需要注意的是，`export`和`export default`是 ES 模块的语法，可用于现代的 Node.js 版本和一些支持 ES 模块的浏览器环境。在较旧的 Node.js 版本中，可能需要使用其他模块系统（如 CommonJS）的语法来导出和导入模块。

### exports module.exports 和 export 的区别

在 Node.js 中，有三种常用的导出模块的方式：`exports`、`module.exports`和`export`（ES 模块语法）。

1. `exports`：

   - `exports`是`module.exports`的一个引用。
   - 当你使用`exports`导出一个模块时，实际上是在修改`module.exports`的内容。
   - `exports`可以通过添加属性或方法来导出多个成员，但不能直接将`exports`指向一个新的对象。

   示例：

   ````javascript
   // module.js
   exports.name = 'John';
   exports.greet = function() {
     console.log('Hello!');
   };

   // app.js
   const myModule = require('./module.js');
   console.log(myModule.name);  // 输出: John
   myModule.greet();  // 输出: Hello!
   ```

   ````

2. `module.exports`：

   - `module.exports`是真正用于导出模块的对象。
   - 当你将一个值赋给`module.exports`时，它将覆盖`exports`的引用。
   - `module.exports`可以是一个对象、函数、字符串等任何类型的值。

   示例：

   ````javascript
   // module.js
   module.exports = {
     name: 'John',
     greet: function() {
       console.log('Hello!');
     }
   };

   // app.js
   const myModule = require('./module.js');
   console.log(myModule.name);  // 输出: John
   myModule.greet();  // 输出: Hello!
   ```

   ````

3. `export`（ES 模块语法）：

   - `export`关键字是 ES 模块语法中用于导出模块的关键字。
   - 它可以用于命名导出（Named exports）和默认导出（Default export）。
   - 命名导出使用`export`关键字导出多个成员，而默认导出使用`export default`关键字导出一个默认成员。

   示例：

   ````javascript
   // module.js
   export const name = 'John';
   export function greet() {
     console.log('Hello!');
   }

   // app.js
   import { name, greet } from './module.js';
   console.log(name);  // 输出: John
   greet();  // 输出: Hello!
   ```
   ````

总结：

- `exports`和`module.exports`是 Node.js 的模块系统的一部分，用于导出模块的成员。
- `exports`是`module.exports`的一个引用，可以通过添加属性或方法来导出多个成员。
- `module.exports`是真正用于导出模块的对象，可以是任何类型的值。
- `export`是 ES 模块的语法，用于导出模块的成员，可以使用命名导出或默认导出。它在一些支持 ES 模块的浏览器环境和现代的 Node.js 版本中可用。
