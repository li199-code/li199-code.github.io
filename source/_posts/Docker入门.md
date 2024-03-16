---
title: Docker入门
date: 2023-01-31 11:15:33
tags:
  - docker
categories:
---

公司的项目是用 docker 来部署的。之前看过一个 docker 科普视频，还没有动手实践过。现在将查到的东西做一个梳理（windows 平台）。

# docker 基本概念

docker 把一个应用的**代码文件和依赖的环境**打包进一个容器，并且这个容器可以极其方便地部署在不同的机器上。docker 有以下三个主要文件：

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

```bash
docker build -t koa-demo .
```

`-t`指定 image 文件的别名，不然就是一串哈希字符。注意最后有一个点，表示 dockerfile 就在当前路径。运行后，新生成的 image 文件存在 windows 下的 `C:\Users\${用户名}\AppData\Local\Docker\wsl\data\ext4.vhdx`. 但是，要看是否创建成功，指令 `docker image ls。`

有了 image 文件，可以正式创建容器：

```bash
docker run -dp 8000:3000 koa-demo
```

`-d` detached, 单独模式，在后台运行。`-p`建立本机和容器端口之间的映射，即本机的 8000 映射到容器的 3000。`koa-demo`就是容器的别名。

补充：Docker 中的数据卷（Volume）是用来持久化容器中的数据的一种机制。数据卷可以在容器之间共享数据，并且可以保持数据的持久性，即使容器被删除或重新创建，数据仍然会保留。

```bash
docker volume create my_volume
docker run -d --name my_container -v my_volume:/path/to/mount my_image
```

终止容器，首先运行 `docker ps`，获得 容器名称或 id，运行 `docker stop [name]`。删除容器：`docker rm [name]`。

## docker compose

compose 是一个 docker 系统的工具，可以一次管理多个容器，并且替代了 bash 脚本，而使用 yaml 来启动容器。在 linux 中，它需要单独安装：

```bash
curl -L https://github.com/docker/compose/releases/download/1.3.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

常用命令：

> docker-compose up：启动应用，并创建、启动所有定义的服务容器。如果服务不存在，会先构建镜像。可以通过 -d 选项使应用在后台运行。
> docker-compose down：停止并删除应用的所有容器、网络、存储卷等相关资源。
> docker-compose start：启动应用的所有容器，但不重新创建。
> docker-compose stop：停止应用的所有容器，但不删除。
> docker-compose restart：重启应用的所有容器。
