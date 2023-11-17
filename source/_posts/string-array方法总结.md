---
title: 'string/array方法总结'
date: 2022-08-24 14:55:55
tags: 
- javascript
---
string、array是非常常用的数据类型。对下面的常用方法进行总结。

<!-- more -->

### string

说明：str表示某一个字符串

字符串长度：str.length

查找子字符串位置：str.indexOf(substr).可以接受第二个参数作为起始检索位置。

str.search()功能和indexOf一致，但是search不能接受第二个参数。

slice(), substring(), substr(): slice(切片)，三者都接收索引参数，截取子字符串。substr()第二个参数是要截取的字符串长度

replace(): 替换字符串，只替换首个。如果要全局替换，则要用正则表达式。

str.toUpperCase() 转化为大写

concat():concat(连接),和加号一样的功能。可以多加几个concat实现多个字符串拼接。

返回字符的安全方法：str.charAt()。 用 `str[0] //h`也能返回正确结果，但不安全。

str.split() split（分割） 根据分隔符返回数组

面试题：slice是干嘛的、splice是否会改变原数组

```
1. slice是来截取的
	参数可以写slice(3)、slice(1,3)、slice(-3)
	返回的是一个新的数组
2. splice 功能有：插入、删除、替换
	返回：删除的元素
	该方法会改变原数组

	array.splice(index, howmany, item1, ....., itemX)

	参数	描述
	index	必需。整数，指定在什么位置添加/删除项目，使用负值指定从数组末尾开始的位置。
	howmany	可选。要删除的项目数。如果设置为 0，则不会删除任何项目。
	item1, ..., itemX	可选。要添加到数组中的新项目。
```

### 补充方法

#### 转为字符串

x.toString():转化为字符串
String(x):全局方法，转化为字符串
num.toFixed():数字转化为指定位数的小数字符串

#### 转为数字

parseInt(x): 全局方法，字符串->整数,直接去掉小数部分，类似于Math.floor(x)
parseFloat(x): 全局方法，返回浮点数
Number(x): 全局方法，可以将字符串，日期，boolean转化为数字
+'100':一元+运算符，返回数字

#### 其他

x.valueOf():大多数情况下返回变量自身，日期调用本方法会返回毫秒数

### array方法总结

arr是某个数组

如何识别数组：因为typeof arr返回Object，所以用Array.isArray(arr)和arr instanceof Array来判断

数组转为字符串：arr.toString() 结果是逗号分隔的字符串。还可以通过arr.join('分隔符')来指定分隔符。

pop,push,shift,unshift:略

想在任意位置删除元素：arr.splice()

合并数组：arr1.concat(arr2)

返回子数组：arr.slice()

数组排序：自带接口：arr.sort()
注意点：1.默认按字符串顺序升序，也就是说数字排序会错。2.为了解决数字排序，需要传入一个参数函数。

查找最大、最小值：数组没有自带的api，需要借助Math对象。

```js
let max = Math.max(...arr)
let min = Math.min(...arr)
注：...arr为扩展运算符
```

回调函数：其参数为上一步代码获得的结果

数组迭代：为数组的每一个元素执行操作

Array.forEach(callback) (callback为回调函数)
forEach不会更改原数组，也不会返回任何东西，它只负责将元素交给回调函数处理。

```js
var txt = "";
var numbers = [45, 4, 9, 16, 25];
numbers.forEach(myFunction);

function myFunction(value, index, array) {  // value, index, array来自数组,其中，index, array可省略
  txt = txt + value + "<br>"; 
}
```

Array.map(callback): 通过对每个数组元素执行函数来创建新数组。不改变原数组，返回新数组

```js
var numbers1 = [45, 4, 9, 16, 25];
var numbers2 = numbers1.map(myFunction);

function myFunction(value, index, array) {
  return value * 2;
}
```

filter() 方法创建一个包含通过测试的数组元素的新数组。

```js
var numbers = [45, 4, 9, 16, 25];
var over18 = numbers.filter(myFunction);

function myFunction(value, index, array) {
  return value > 18;
}
```

arr.indexOf()

### 其他数据类型（日期等）

创建日期：new Date(str) str可省，则为当前时间

方法：getTime()：时间戳，毫秒值

Math类：
Math.random() 0-1的随机数,小数点后17位

注：Array/String/Boolean可以用new的方式创建，但是没有意义且可能会带来错误，因为new出来数据类型都是对象

注：typeof的结果：

NaN 的数据类型是数字
数组的数据类型是对象
日期的数据类型是对象
null 的数据类型是 object
未定义变量的数据类型为 undefined *
未赋值的变量的数据类型也是 undefined *
