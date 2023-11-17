---
title: 基于docker的django+vue网站部署
author: Jason Lee
date: 2023-05-29 22:28:41
tags: 
- docker
- django
- uwsgi
- nginx
categories: 全栈项目wey
---

## 前言

部署和开发是两个完全不同的工作。得益于docker等虚拟化技术，现在的部署已经简单许多了。尽管作者是用原生linux环境做示范，但是我选用docker作为部署工具。主要以查找博客和问chatgpt来学习，中间由于对nginx不了解，还看了相关的视频教程。大概花了三四天时间，从本地win环境，到最终的云主机。现在，我终于可以说，自己是一个全栈工程师了，真正从应用的开发到落地都有了粗浅的涉及。

## 总体流程图

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16857932628311685793261939.png)

这是两容器之间的配合示意图。外部的请求从宿主机的8000端口进来，然后被docker投射到容器1，交给nginx处理。nginx根据请求的url，判断是动态还是静态请求。如果是静态，则去找vue项目打包来的文件夹dist内的资源并返回；如果是动态资源，通过http方式转发给容器2的端口8000。uwsgi处理完逻辑后，将可能有的响应转回给nginx，再返回给用户。

## 项目结构

```
wey
 ├── docker-compose.yml 
 ├── wey-frontend
 │   ├── dist
 │   ├── Dockerfile
 │   ├── index.html
 │   ├── nginx.conf
 │   ├── node_modules
 │   ├── package-lock.json
 │   ├── package.json
 │   ├── postcss.config.js
 │   ├── public
 │   ├── README.md
 │   ├── src
 │   ├── tailwind.config.js
 │   └── vite.config.js
 └── wey_backend
     ├── account
     ├── chat
     ├── db.sqlite3
     ├── Dockerfile
     ├── manage.py
     ├── media
     ├── notification
     ├── pip.conf ## 给容器2的pip换源
     ├── post
     ├── requirements.txt
     ├── scripts
     ├── search
     ├── uwsgi.ini
     └── wey_backend

```

## 容器1配置

```
# nginx.conf

server {
    listen 80;
    server_name 127.0.0.1;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://django:8000;
    }

    location /static {
        alias '/var/www/mysite/assets/static';
    }

    location /media {
        alias '/var/www/mysite/assets/media';
    }

    location /admin/ {
        proxy_pass http://django:8000;
    }

}

```
对应的dockerfile:
```
# 使用一个基础的 Node.js 镜像作为构建环境
FROM node:14 as builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 文件到容器中
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制前端应用源代码到容器中
COPY . .

# 执行构建命令
RUN npm run build

# 创建一个新的容器镜像
FROM nginx:latest

# 复制构建产物到 Nginx 的默认静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 将自定义的 nginx.conf 文件复制到容器中，覆盖默认配置
# remove the default conf
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露容器的 80 端口
EXPOSE 80


```

## 容器2配置

```
[uwsgi]

module = wey_backend.wsgi
py-autoreload=1
http-timeout = 86400

http=0.0.0.0:8000

master=true
processes = 4
threads=2

chmod-socket=666

vaccum=true
die-on-term=true
```

对应的dockerfile配置：
```
FROM python:3.11
RUN mkdir /code
WORKDIR /code
COPY . /code

COPY pip.conf /root/.pip/pip.conf

# uwsgi setup
RUN pip install uwsgi
RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["uwsgi", "--ini", "uwsgi.ini"]
```

## docker-compose

docker compose是在有多个容器且容器之间存在依赖关系时适用。它取代的是命令行构建镜像和创建容器的方式，使得部署更简洁。比如在nginx中，ports:"8000:80"，是在建立端口映射。volumes:是在把特定的目录在整个docker应用进程内建立一个索引，实现文件共享。

```
version: "3.9"
services:
  nginx:
    build: ./wey-frontend/
    restart: always
    ports:
      - "8000:80"
    volumes:
      - web_static:/var/www/mysite/assets/static
      - web_media:/var/www/mysite/assets/media
    depends_on: 
      - django
    

  django:
    build: ./wey_backend/
    restart: always
    expose:
      - 8000
    command: >
      sh -c "python manage.py collectstatic --noinput 
      && uwsgi --ini uwsgi.ini"
    volumes:
      - web_static:/var/www/mysite/assets/static
      - web_media:/var/www/mysite/assets/media

volumes:
  web_static:
  web_media:
```

## 总结

这篇文章实现了用docker来部署django+vue的前后端分离网站，并用docker-compose来简化了部署。

为什么中间遭遇了较大的挫折并且一度想放弃呢？反思的结果是，自己一开始就把多个容器放在一起考虑，导致头绪纷乱无章。后面在尝试了测试两个容器是否能独立运行，然后联合运行，才成功。