---
title: vue和django项目的开发/生产环境配置管理
author: Jason Lee
date: 2023-06-26 22:33:30
tags: 
- vue
- django
- 最佳实践
categories: 全栈项目wey
---

## 前言

虽然教程作者提到了一些分开管理两种环境的做法，但是我这边没有形成完整可复制的做法。借助chatgpt，将收获整理出来。

## vuejs

在项目的根目录下，分别创建两个文件：`.env.development` and `.env.production`。最基础的设置是api地址：

```
# .env.development
VITE_API_URL=http://dev-api.example.com

# .env.production
VITE_API_URL=http://api.example.com
```

任何设置都有以VITE_开头。为了区别使用配置，在`vite.config.js`中，有如下：

```
export default defineConfig({
  // 开发环境使用 .env.development 文件
  envDir: './',
  build: {
    // 生产环境使用 .env.production 文件
    envFile: '.env.production',
  },
});
```

## django

相对于vue, django的设置就要复杂一些了。这里把gpt关于生产和开发环境的不同列出来，虽然有很多在这个项目没有实现，但是可以为以后更复杂的真实项目做参考。

> 在 Django 项目中，开发环境和生产环境通常需要进行不同的设置。下面是一些常见的设置差异：
> 
> 调试模式（Debug Mode）：
> 
> 开发环境：设置 DEBUG = True，以便在出现错误时显示详细的错误信息。
生产环境：设置 DEBUG = False，以避免显示敏感信息和详细的错误信息。
数据库设置：
> 
> 开发环境：通常使用本地数据库（如 SQLite）进行开发和测试。
生产环境：使用更稳定和可靠的数据库服务器（如 PostgreSQL、MySQL、Oracle）。
静态文件设置：
> 
> 开发环境：通常将静态文件存储在本地，并通过 Django 的 staticfiles 应用程序来提供静态文件服务。
生产环境：可以使用 CDN（内容分发网络）来提供静态文件，以减轻服务器负载并提高速度。
日志设置：
> 
> 开发环境：可以设置较详细的日志记录级别，以便更容易调试和跟踪问题。
生产环境：通常使用更严格的日志记录级别，并将日志信息定向到适当的日志文件，以便进行监视和故障排除。
密钥和敏感信息：
> 
> 开发环境：可以在本地设置中直接存储密钥和敏感信息。
生产环境：建议使用环境变量或其他安全的方式来存储密钥和敏感信息，以保护生产环境的安全性。
域名设置：
> 
> 开发环境：可以使用本地的开发服务器（如 localhost）进行开发和测试。
生产环境：设置正确的域名，并配置 Web 服务器（如 Nginx 或 Apache）以将请求转发到 Django 应用程序。
缓存设置：
> 
> 开发环境：可以禁用缓存或使用简单的缓存配置，以方便开发和调试。
生产环境：使用更高效的缓存后端（如 Memcached 或 Redis）来提高性能。
这些只是一些常见的设置差异，实际上还可以根据项目需求和部署环境的要求进行更多的设置和调整。

本项目中，在根目录下创建了三个文件，`settings_common.py`, `settings_dev.py`, `settings_prod.py`。其中common是两种环境之间共享的通用配置，然后在dev和prod中分别引用common:

```
from .settings_common import *
```

然后在dev和prod各自写一些配置（比如数据库等）。之后修改启动文件`manage.py`:

```
import os
import sys

if os.environ.get('DJANGO_ENV') == 'production':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings_prod')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings_dev')

def main():
    # 启动逻辑...

if __name__ == '__main__':
    main()
```

如果要部署，记得把环境变量添加上，即设置 DJANGO_ENV 环境变量为 'production'. 而且如果是uwsgi作为django的服务器的话，还有修改`wsgi.py`。

## 总结

前端vue的环境区别很简单，后端django的稍复杂些。主要分三步走：编写配置文件->修改启动文件->部署设置环境变量。