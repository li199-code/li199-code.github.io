---
title: django-rest-framework使用入门
author: Jason Lee
date: 2023-05-02 14:19:07
tags: django
categories:
---

## 浏览器行为

当我用drf提供的浏览器可视化界面，发现了一个奇怪的问题。同样是访问`http://127.0.0.1:8000/snippets/`，如果我之前填了一个表单并提交，那么按刷新按钮，会再提交一次，也就是会在数据库中添加一条和上一次一样的数据。只有在地址栏回车一下，才会真正回到列表中。这说明，如果页面中有表单，刷新按钮可能会执行post请求，而浏览器回车才能保证发出的get请求。

## 到底什么是序列化

python的数据格式（字典、列表等），转化为可以传输的字符串（JSON、HTML等），就是序列化。序列化类的实例并不是直接生成json数据，而是将模型实例转为一种python字典，然后由视图函数的`JSONRenderer().render()`函数转化为json字符串。

反过来，如果接受到了json，按照下列方式：

```
import io

stream = io.BytesIO(content)
data = JSONParser().parse(stream)

serializer = SnippetSerializer(data=data)
serializer.is_valid()
# True
serializer.validated_data
# OrderedDict([('title', ''), ('code', 'print("hello, world")\n'), ('linenos', False), ('language', 'python'), ('style', 'friendly')])
serializer.save()
# <Snippet: Snippet object>
```

和表单的处理很相似。