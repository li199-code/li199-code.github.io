---
title: Django入门和配置
date: 2022-11-10 13:50:11
tags:
  - django
---

Django 是 python 的一个 web 后台框架。他的特点是大而全，因此本身命令和代码构架和原生 python 有较大区别，这篇文章是对 django 从入门到项目运行的学习记录。

<!-- more -->

# 常用命令 d

```shell
django-admin startproject name  //创建项目目录
python manage.py runserver //启动项目
django-admin startapp name //创建app
```

# 基本概念

在 django 体系中，一个网站由多个 app 组成，每个 app 都有完整的 MTV 体系：

- M，model，负责建立和数据库的连接
- T，Template，负责 html
- V，view，负责处理请求逻辑，比如是请求页面还是数据,是函数形式

## 新项目初始化设置

app：类名.apps.类名 Config。app 里面有 models.py, views.py.手动创建一个 urls.py。把模块用到的 url 放进去。把处理请求的函数放在 views.py. 最后，回到‘大哥’文件夹的 urls.py, 用 include 方式引入 app 的 urls.

## template 创建

template 不是重点。

首先，在根目录下创建 templates 文件夹，在下面建立 html 文件。之后在 settings.py 里注册一下，使项目认识 templates 文件夹。这样，调用 render 函数时，第二个参数字符串就会寻找 html 模板文件。

模板文件同样需要解耦。在 app 下建立 templates folder，下面子文件夹名为 app 的名字。创建模板文件。在 views.py 里改 render 参数的路径。

extends 和 include 引入的模板要放在根目录下的 tempplates folder.

## migration 迁移

迁移似乎不是很直观。可以理解为在 models.py 中进行了相关表的创建和修改字段等操作，并应用到数据库中。django 默认的数据库是 sqlite。具体流程是：

1. 在 model.py 中建立一个 class
2. 将 class 在 admin.py 中注册
3. 运行两条命令: makemigrations(会在 migrations 文件夹下建立一个带序号的 py 文件，相当于提交修改）和 migrate（执行修改）

## 静态文件的部署

静态文件的部署和 setting 有关。这里用 django 推荐的模板语法写。如果我们要配置整个 project 下的静态文件的话，执行此步骤。

```python
 STATICFILES_DIRS = (
  os.path.join(BASE_DIR, "static"), # 首选project静态文件搜寻路径
  '/var/www/static/', # 第二选project静态文件搜寻路径，还可以有第三选，第四选……
 )
```

访问顺序：会先访问 app 下的 static/文件夹下的 myexample.jpg 文件，若 app 下的 static 文件夹中没有该文件，则访问 project 中的 static/文件夹，查看是否有 myexample.jpg 文件，若有则返回，若没有则去/var/www/static/中寻找。[参考链接](https://cloud.tencent.com/developer/article/1741406)

```python
python manage.py collectstatic
```

为什么要使用 STATIC_ROOT 呢，是因为当你设置中 DEBUG 为 True 时，django 会自动为你静态文件代理，不过当 DEBUG 为 False 时，意味着你要进入生产环境，那么，你就必须使用 STATIC_ROOT 来指明你的静态文件在哪里，就像 MEDIA_ROOT 一样。部署过程中，输入上面这条命令就将静态文件集中起来了。

完整的静态文件配置如下：

```python
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static")
]
STATIC_ROOT = os.path.join(BASE_DIR, "static")
```

## ORM django 如何与数据库交互

![1668480185606.png](https://img1.imgtp.com/2022/11/15/qgoC6U6I.png)

## ORM

ORM(object relational mapping),对象关系映射，是将数据库的记录视作程序中的对象。

ORM 可以将用户的 python 语句翻译为 sql 语句交给 mysql 等数据库执行。它的好处是不用写很多的 sql 语句，可以连接多种数据库。除了建立数据库需要手动在 mysql 客户端外，建表、删表、操作表内数据都可以用 ORM 完成。models.py 文件可以视为建表操作，每次更改这个文件，就要执行下列命令，将更改应用到数据库中，同时会在 migrations 文件夹内留下历史记录，类似于 github 提交。

```shell
python manage.py makemigrations
python manage.py migrate
```

建表完毕后，要在 views.py 中对表数据修改。首先要正确引入 models 文件，要写全路径：

```python
from app01.models import UserInfo
```

```python
UserInfo.objects.create(name=user, password=pwd, age=age)
## objects，对象，在orm中，一行数据视作一个对象
## all():所有数据，filter() 就类似与sql的where
## create:增加，update：改，delete：删除
```
