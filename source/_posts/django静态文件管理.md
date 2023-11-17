---
title: django静态文件管理
author: Jason Lee
date: 2023-05-30 20:57:21
tags: django
categories:
---

### 前言

可以分为开发和部署两个阶段进行介绍。

### 开发

STATIC_URL = "static/"（默认设置好的），这一项是告诉django，静态文件存在每一个应用的哪一个文件夹下，方便后面收集静态文件到一处。还有一个用途是，给出资源的引用位置。例如，如果STATIC_URL设置为'/static/'，则可以通过http://yourdomain.com/static/css/styles.css来访问名为styles.css的CSS文件。

另外，如果某些静态文件不属于任何一个应用，或者所在文件夹名字和STATIC_URL不同，可以将文件夹名放在STATICFILES_DIRS：

```
STATICFILES_DIRSSTATICFILES_DIRSSTATICFILES_DIRSSTATICFILES_DIRSSTATICFILES_DIRS = [
    BASE_DIR / "static",
    "/var/www/static/",
]
```

这两项都和STATIC_URL不同。

当需要在开发阶段提供静态文件服务时，可以在根应用的urls.py里设置：

```
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... the rest of your URLconf goes here ...
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
```

还有一种用户上传的静态文件，用MEDIA_URL，类似于STATIC_URL.

```
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... the rest of your URLconf goes here ...
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### 部署

首先要明确，部署阶段时的静态文件管理到底为什么要和开发阶段区分开来？

> 在开发阶段，开发人员通常会使用各种工具和技术来编写和测试代码。他们经常需要修改代码和调试，以确保功能的正确实现。在这个阶段，开发人员通常希望在每次修改代码后能够快速地查看结果，以便及时调试和验证功能。为了实现这个目标，他们通常会使用本地开发服务器，在其中运行代码并动态生成页面。在开发过程中，静态文件（如HTML、CSS、JavaScript、图像等）可能会被直接从开发环境的文件系统加载，或者通过开发服务器进行实时编译和转换。
> 
> 然而，当代码准备好部署到生产环境时，情况就会有所不同。在部署阶段，我们通常希望优化网站或应用程序的性能和加载速度。这就涉及到对静态文件的管理和优化。
> 
> 静态文件管理在部署阶段的目标是将这些文件进行优化和准备，以便在生产环境中提供最佳的性能和用户体验。这可能包括压缩和合并CSS和JavaScript文件、优化图像大小和格式、设置缓存策略以减少加载时间等。
> 
> 另外，静态文件管理还可以包括将文件上传到内容分发网络（Content Delivery Network，CDN）上，以确保文件在全球范围内的快速传输和分发。
> 
> 通过将开发阶段和部署阶段的静态文件管理分离开来，可以使开发人员专注于开发和调试代码，而不必担心性能优化和部署的细节。这也有助于确保在生产环境中获得最佳的性能和用户体验。

STATIC_ROOT：collectstatic 将收集静态文件进行部署的目录的绝对路径。例如： "/var/www/example.com/static/"，而搜集的源头就是上述的STATIC_URL和STATICFILES_DIRS。

### 参考资料
https://docs.djangoproject.com/zh-hans/4.2/ref/settings/#std-setting-STATIC_URL
