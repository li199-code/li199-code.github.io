---
title: django get和post获取请求参数或路由变量
author: Jason Lee
abbrlink: 3d3c510a
date: 2023-05-13 22:31:53
tags:
categories:
---

## 前言

前后端分离的情况下，数据通过 axios 传输到后端，如何取出携带的数据？

## get 请求

get 请求里面，可能携带的参数位置都在 url 上，分别是路径上的参数和查询参数：

![](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/16839892604181683989259695.png)

类视图中的获取方式如下：

```python
def get(self, request, *args, **kwargs):
    user_id = kwargs.get('id') # 路径参数
    filter_type = request.GET.get('query') # 查询参数
```

而在 urls.py 中，pk 要作为参数的名字被设置：

```
path('friend/request/<uuid:pk>/', api.FriendshipRequestView.as_view(), name='friendshiprequest'),
```

## post 请求

两种可能的参数，一种是通过表单传来的数据，另一种是通过 json 格式传来的数据：

```
axios.post('/api/login/', this.form) # 通过表单
axios.post('api/post/', {'body': this.body}) # 通过json
```

他们的获取方式分别是：

```
def post(self, request,  *args, **kwargs):
    form = request.POST # 表单
    body = request.data.get('body') # json

```

request.data 也可以获得表单数据，所以建议还是都用 request.data
