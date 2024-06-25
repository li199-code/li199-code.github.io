---
title: javascript 模块机制
tags:
  - nodejs
  - es6
abbrlink: 84f29cc2
date: 2023-02-02 15:20:42
categories:
summary: 讲解了JavaScript两种最常见模块机制ES Modules和CommonJS，并举例说明。
---

## 前言

最近阅读《深入浅出 nodejs》和《nodejs 实战》的时候，都把模块系统放在前面的位置介绍，可见其重要性。模块机制帮助开发者将代码分割成独立的、功能明确的块，可以单独开发、测试和维护。因为之前写的文章逻辑比较混乱，故重新写一下。

JavaScript 主要有以下几种模块机制：

- ES6 模块 (ES Modules)
- CommonJS 模块
- AMD 模块
- UMD 模块

其中，最常见的莫过于前两种。

## ES Modules

这是在 ES6（ECMAScript 2015）中引入的标准模块系统。ES6 模块通过 import 和 export 关键字来导入和导出模块。ES6 模块具有以下特点：

- 静态结构：模块的依赖关系在编译时就能确定，不需要在运行时解析。这使得工具可以进行静态分析和优化。（这是不是基于 Nodejs 的后端代码也要采用 ES6 模块机制的原因？）
- 文件即模块：每个文件被视为一个独立的模块。
- 默认导出和命名导出：可以导出多个命名导出，也可以有一个默认导出。从格式来看，采用命名导出时，导入文件中，模块名外带花括号，而默认导出则相反。
- 多入口加载，结合第一点，因而可以实现按需加载。

示例：

导出模块 (math.js)

```javascript
// Named exports
export function add(a, b) {
  return a + b;
}

export const PI = 3.14159;

// Default export
export default function subtract(a, b) {
  return a - b;
}
```

导入模块 (main.js)

```javascript
// Importing named exports
import { add, PI } from "./math.js";

console.log(add(2, 3)); // 5
console.log(PI); // 3.14159

// Importing the default export
import subtract from "./math.js";

console.log(subtract(5, 2)); // 3
```

注意事项：

- 模块路径：相对路径或绝对路径需要明确指定。
- 顶级作用域：ES6 模块在模块顶级作用域中运行，因此每个模块都有自己的独立作用域。

## CommonJS

CommonJS 模块是 Node.js 使用的模块系统，通过 require 导入模块和 module.exports 导出模块。CommonJS 模块具有以下特点：

- 动态加载：模块在运行时加载，require 是一个同步操作。
- 整个模块导出：可以导出一个对象，该对象包含多个属性和方法。
- 单一出口：模块通过 module.exports 导出单一对象。

示例：

导出模块 (math.js)

```javascript
function add(a, b) {
  return a + b;
}

const PI = 3.14159;

function subtract(a, b) {
  return a - b;
}

module.exports = {
  add,
  PI,
  subtract,
};
```

导入模块 (main.js)

```javascript
const math = require("./math");

console.log(math.add(2, 3)); // 5
console.log(math.PI); // 3.14159
console.log(math.subtract(5, 2)); // 3
```

注意事项：

- 动态加载：模块在代码执行到 require 语句时才会加载。
- 缓存：一旦模块加载，它会被缓存，再次 require 相同模块时将返回缓存的版本。

## 比较 ES6 模块和 CommonJS 模块

| 特性           | ES6 模块                     | CommonJS 模块                     |
| -------------- | ---------------------------- | --------------------------------- |
| 语法           | import / export              | require / module.exports          |
| 加载方式       | 静态加载                     | 动态加载                          |
| 依赖关系       | 编译时确定                   | 运行时确定                        |
| 顶级作用域     | 模块级作用域                 | 文件级作用域                      |
| 是否支持浏览器 | 是                           | 否（需要打包工具，如 Browserify） |
| 缓存机制       | 浏览器端和服务器端缓存均支持 | 服务器端缓存                      |
| 默认导出       | 支持                         | 需要手动指定                      |
