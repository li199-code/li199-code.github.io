---
title: nodejs构建服务器
date: 2022-07-27 21:31:25
tags: nodejs
---

## 从nodejs服务器想到的

服务器的定义是，监听请求，处理请求和做出响应。除了nodejs外，其他语言也有对应的web server框架，比如java的tomcat。

用下列代码实现一个简单的服务器：
<!--more-->

```javascript
var http = require('http')
var fs = require('fs')
http.createServer(function (request, response) {
    fs.readFile('1.txt', (err, data)=>{
        response.setHeader("Access-Control-Allow-Origin", "*")
        response.end(data)
    })
}).listen(3000, function () {
    console.log('running')
})
```

用node命令执行上述代码后，就可以发送请求了。我们总说请求，可是请求究竟有哪些类型呢？网上将http请求分为get\post等8种类型，我觉得，从另一个角度，可以分为全局型和局部型。全局型是浏览器输入框改变，则会发起请求，并刷新页面。而局部型如ajax，只更新dom树几个节点的内容，不刷新页面。

全局型请求，是通过更改末尾地址实现。而上面的代码对于所有请求的响应都相同。所以，可以通过路由分发来实现不同地址响应。