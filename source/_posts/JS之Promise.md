---
title: JS之Promise
date: 2022-07-26 17:58:45
tags: javascript
---
## 为什么需要promise

首先，存在一次异步任务的需求。然后又有了多次异步任务的需求，而多次异步的书写存在函数瀑布问题，不利于阅读和维护：

<!--more-->

```javascript
    setTimeout(function () {
        console.log("First");
        setTimeout(function () {
            console.log("Second");
            setTimeout(function () {
                console.log("Third");
            }, 3000);
        }, 4000);
    }, 1000);
```

所以，出现了promise对象，将多次异步代码写成顺序格式而非嵌套格式：

```javascript
    function print(delay, message) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log(message);
                resolve();
            }, delay);
        });
    }
    print(1000, "First").then(function () {
        return print(4000, "Second");
    }).then(function () {
        print(3000, "Third");
    });
```

因此，异步是异步，promise是promise，异步任务的实现靠的是异步函数，而不是promise，promise仅是改变了书写格式。

## promise的状态和结果

Promise是一个构造函数，它接收一个函数作为形参，实例化一个p对象。相比于普通对象，p对象有两个特殊属性：状态和结果。

### 状态

通过在形参函数中调用resolve()和reject()改变状态，并且只能改一次.状态有三种，分别是pending/fullfilled/reject.没执行resolve() or reject()之前的状态是pending。

### 结果

通过resolve/reject函数传递参数，改变当前promise对象结果

```js
const p = new Promise((resolve, reject)=>{
	resolve('homo')
})
console.log(p); // state:fullfilled, result:'homo'
```

## 构造函数和then方法

<!-- then方法可以接收两个函数作为形参，第一个是处理成功状态的事件，第二个处理失败状态的事件。在p对象中的`resolve()`方法内可传入数据，数据流入到上面对应的两个函数之一。 -->
promise是靠多个then完成异步任务的嵌套的。怎么实现的？then可以注册resolve和reject。若要嵌套，要写成下面这种形式,return一个新的promise，value在异步代码中使用。

```js
		new Promise((resolve)=>{
			// setTimeout(()=>{
			// 	resolve('1')
			// },500)
		}).then((value)=>{
			return new Promise((resolve)=>{
				setTimeout(()=>{
					resolve(value+' 2')
				})
			})
		}).then((value)=>{
			// console.log(value);
		})
```

<!-- then方法将返回一个新的promise对象，初始状态为pending。promise状态不改变，就不会执行then里的方法。

在then方法中，通过return将返回的promise实例状态修改为fullfilled。return返回的数据将会作为下一个then中`处理成功状态的事件`方法的参数，从而达到拿到数据的操作。

如果在then中return一个新的promise对象，就相当于替换当前的默认promise，从而可以执行promise执行体内的代码，实现特定业务逻辑。 -->

把promise对象当作一个容器，里面装了一个异步事件，promise对象保证了当前异步事件执行完毕才会执行下一个事件。

这里引用一下知乎的回答：<a href='https://zhuanlan.zhihu.com/p/26523836'>

1. 构造实例
构造函数接受一个函数作为参数
调用构造函数得到实例p的同时，作为参数的函数会立即执行
参数函数接受两个回调函数参数resolve和reject
在参数函数被执行的过程中，如果在其内部调用resolve，会将p的状态变成fulfilled，或者调用reject，会将p的状态变成rejected

2. 调用.then
调用.then可以为实例p注册两种状态回调函数
当实例p的状态为fulfilled，会触发第一个函数执行
当实例p的状态为rejected，则触发第二个函数执行

如果代码执行出现错误，而没有catch或者then接受错误的话，控制台会报错。


下面的代码可以充分体现了，promise对象解决了异步函数的多重回调问题。

```js
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js"></script>
	<script>
		function getData(url, data={}){
			return new Promise((resolve, reject)=>{
				$.ajax({
					type:'GET',
					url:url,
					data:data,
					success:function(res){
						const {result} = res
						console.log(res);
						resolve(result)
					}
				})
			})
		}

		getData('data1.json').then((value)=>{
			getData('data2.json', value)
		} ) 
	</script>
</body>
</html>
```

## Promise.all()

作用：一次接受多个异步事件，并保证他们的都得到结果了，才会执行then
输入参数：数组、map等
输出：一个新的promise对象，根据数组中所有promise的执行结果而进入不同的函数。若数组中所有的promise都是fullfilled，则会执行then。

## Promise.any()
作用：一次接受多个异步事件，其中有一个成功就行
输入参数：数组、map等

## Promise.resolve(p)/reject(p)

返回一个状态为fullfilled/rejected,结果为p的promise对象。


