---
title: Docker入门
date: 2023-01-31 11:15:33
tags:
  - docker
categories:
---

公司的项目是用 docker 来部署的。之前看过一个 docker 科普视频，还没有动手实践过。现在将查到的东西做一个梳理（windows 平台）。

# docker 基本概念

docker 可以理解为一个简易的虚拟机，它去掉了一个完整操作系统中不需要的部分，仅保留能让应用程序（mysql, jvm, php）等运行起来的环境。它让代码项目可以极其方便地部署在不同的机器上。docker 有以下三个主要文件：

- DockerFile 描述了如何创建 image 文件及其基本信息
- image 文件 环境的完整信息，类似于 windows 安装时的 iso 文件，便携，可以发布到公共空间供他人下载。
- container 容器，本机系统上的一个进程，将自身与外部操作系统隔离。

# docker 使用方式

让我们从 DockerFile 开始。首先编写 dockerignore 文件，忽视某些文件和文件夹，使之不要打包进 image 文件。是不是很类似于 gitignore？是的，image 文件就可类比 git 工作区，可以提交到 dockerhub，一个 image 文件托管平台。然后，编写 DockerFile。它无后缀，可以像下面这样写：

```DockerFile
FROM node:8.4
COPY . /app
WORKDIR /app
RUN npm install --register=https://register.npm.taobao.com
EXPOSE 3000
```

注意，RUN npm install 是在制作 image 文件阶段执行的，说明 npm 包会打包进 image 文件。

有了 DockerFile，就可以创建 image 文件。

```
docker build -t koa-demo .
```

`-t`指定 image 文件的别名，不然就是一串哈希字符。注意最后有一个点，表示 dockerfile 就在当前路径。运行后，新生成的 image 文件存在 windows 下的 `C:\Users\${用户名}\AppData\Local\Docker\wsl\data\ext4.vhdx`. 但是，要看是否创建成功，指令 `docker image ls。`

有了 image 文件，可以正式创建容器：

```
docker run -dp 8000:3000 koa-demo
```

`-d` detached, 单独模式，在后台运行。`-p`建立本机和容器端口之间的映射，即本机的 8000 映射到容器的 3000。`koa-demo`就是容器的别名。

终止容器，首先运行 `docker container ls`，获得 id，运行 `docker container kill [id]`.

# 公司项目部署实战

公司的 vue 前端项目，部署在私有的 docker 服务器。

## 准备工作

注册 docker 账号，然后配置 docker daemon 文件。

## 正式开始

首先打包项目文件到 dist 目录。

```js
"docker:build": "cross-var docker build -t dev2.smart-kind.com:18082/docker/$npm_package_name:$npm_package_version --build-arg ppath=$npm_package_name -f Dockerfile dist",
"docker:push": "cross-var docker push dev2.smart-kind.com:18082/docker/$npm_package_name:$npm_package_version",
```

`yarn docker:build,` `yarn docker:push`将生成的镜像推送到公司服务器。
