---
title: 面试八股准备-ES6特性
date: 2022-08-12 23:23:28
tags: 
- javascript
- interview
- ES6
---

#### var、let、const区别

```
var、let、const 共同点都是可以声明变量的

区别一：
	var 具有变量提升的机制
	let和const没有变量提升的机制
区别二：
	var 可以多次声明同一个变量
	let和const不可以多次声明同一个变量
区别三：
	var、let声明变量的
	const声明常量
	
	var和let声明的变量可以再次赋值，但是const不可以再次赋值了。
区别四：
	var声明的变量没有自身作用域
	let和const声明的变量有自身的作用域
```

#### 箭头函数和普通函数有什么区别？

```
1. this指向的问题
	箭头函数中的this只在箭头函数定义时就决定的，而且不可修改的（call、apply、bind）
	****箭头函数的this指向定义时候、外层第一个普通函数的this
2. 箭头函数不能new（不能当作构造函数）
3. 箭头函数没有原型prototype
4. 箭头函数没有arguments对象