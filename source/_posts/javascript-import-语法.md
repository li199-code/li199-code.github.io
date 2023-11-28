---
title: javascript 模块系统
date: 2023-02-02 15:20:42
tags:
  - nodejs
  - es6
categories:
---

## 前言

最近阅读《深入浅出nodejs》和《nodejs实战》的时候，都把模块系统放在前面的位置介绍，可见其重要性。因为之前写的文章逻辑比较混乱，故重新写一下。

根据环境的不同，对应两种不同的规范：es6（浏览器）和commonjs（服务端的nodejs）。

## 导入

在 JavaScript 中，`import` 和 `require` 都是用于导入模块的关键字，但它们在语法和用法上有一些区别。

1. 语法差异：
   - `import` 是 ES6（ECMAScript 2015）引入的模块导入语法，它使用 `import` 关键字和花括号 `{}` 或者 `*` 来导入具体的模块成员。
   - `require` 是 CommonJS 规范中使用的模块导入语法，它使用 `require` 函数来导入整个模块或指定的模块成员。

2. 动态/静态导入：
   - `import` 是静态导入，它在代码执行之前进行解析和编译，这意味着模块的依赖关系在代码静态分析阶段就会确定。
   - `require` 是动态导入，它在代码执行期间进行解析和执行，这意味着它可以根据条件或代码逻辑来决定加载哪些模块。

3. 浏览器支持：
   - `import` 目前主要用于现代浏览器中的 JavaScript 模块化开发，需要在支持 ES6 模块的环境中使用，或者通过 Babel 等工具进行转换。
   - `require` 主要用于服务器端的 Node.js 开发，也可以通过一些工具（例如 Browserify、Webpack）在浏览器中使用。

综上所述，如果你在浏览器环境中使用 JavaScript 模块，你应该使用 `import` 关键字。如果你在 Node.js 环境中开发，你可以使用 `require` 函数。

示例：

使用 `import` 导入模块：
```javascript
import { moduleA, moduleB } from './myModule';
import * as myModule from './myModule';
```

使用 `require` 导入模块：
```javascript
const moduleA = require('./myModule').moduleA;
const moduleB = require('./myModule').moduleB;
const myModule = require('./myModule');
```

请注意，`import` 和 `require` 的具体用法还取决于模块系统的实现和你的开发环境。

## 导出

ES6（ECMAScript 2015）和 CommonJS 是 JavaScript 中两种不同的模块导出规范，它们在导出模块成员的语法和用法上有一些区别。

ES6 导出规范（使用 `export`）的特点：

1. 单个默认导出：可以使用 `export default` 导出一个默认的模块成员。
   ````javascript
   // 导出默认成员
   export default myFunction;
   ```

2. 命名导出：可以使用 `export` 导出一个或多个具名的模块成员。
   ````javascript
   // 导出具名成员
   export const moduleA = 1;
   export function myFunction() { /* 函数实现 */ }
   ```

3. 命名导出的重命名：可以使用 `as` 关键字对导出的模块成员进行重命名。
   ````javascript
   // 导出具名成员并重命名
   export { moduleA as A, moduleB as B };
   ```

4. 具名导出和默认导出的混合使用。
   ````javascript
   // 混合导出
   export default myFunction;
   export const moduleA = 1;
   ```

CommonJS 导出规范（使用 `module.exports` 或 `exports`）的特点：

1. 单个默认导出：使用 `module.exports` 导出一个默认的模块成员。
   ````javascript
   // 导出默认成员
   module.exports = myFunction;
   ```

2. 命名导出：使用 `exports` 对象导出一个或多个具名的模块成员。
   ````javascript
   // 导出具名成员
   exports.moduleA = 1;
   exports.myFunction = function() { /* 函数实现 */ };
   ```

3. 导出对象字面量：可以直接使用 `module.exports` 导出一个对象字面量，其中包含多个模块成员。
   ````javascript
   // 导出对象字面量
   module.exports = {
     moduleA: 1,
     myFunction: function() { /* 函数实现 */ }
   };
   ```

综上所述，ES6 导出规范在语法上更加简洁和灵活，支持默认导出和命名导出的组合使用。而 CommonJS 导出规范更多地被用于服务器端的 Node.js 开发，它使用 `module.exports` 和 `exports` 对象导出模块成员。

值得注意的是，ES6 模块规范在浏览器环境中需要进行转换或使用打包工具（如 Webpack、Rollup）来使用，而 CommonJS 规范在 Node.js 环境中是原生支持的。
