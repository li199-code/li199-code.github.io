---
title: nginx 入门
tags: nginx
abbrlink: cf06bc3b
date: 2024-03-17 22:12:46
categories:
---

出现报错，nginx 的错误日志位置：

```bash
tail -f /var/log/nginx/error.log
```

## 静态网页

```
server{

    listen 8000;
    server_name localhost;

    location / {
        root /home/AdminLTE-3.2.0;
        index index.html index2.html index3.html;
    }

}
```

location 的运行方式有点绕。首先在浏览器输入网址，最重要的三部分：ip（域名）、端口号、路由。ip 的话，显然不需要写在配置里，因为是固定的。上面的 server_name 字段只是作为一个标识符，起区别作用。端口号对应的就是 listen。路由这部分由 location 确定。location 后面跟的就是路由，那么 nginx 服务器把 root 拼接上述的路由，得到的结果作为文件路径去硬盘里寻找文件（如 index.html）。

## 反向代理

反向代理本身可以视为一种基本能力，是后面的负载均衡、缓存等高级功能的前提。

```
server {

  listen 8001;

  server_name ruoyi.localhost;

  location / {
    proxy_pass http://localhost:8088;
  }

}
```

将 8001 端口收到的请求，转发到 8088 端口。

proxy_pass 配置说明：

```
location /some/path/ {
    proxy_pass http://localhost:8080;
}
```

如果 proxy-pass 的地址只配置到端口，不包含/或其他路径，那么 location 将被追加到转发地址中。
如上所示，访问 http://localhost/some/path/page.html 将被代理到 http://localhost:8080/some/path/page.html

```
location /some/path/ {
    proxy_pass http://localhost:8080/zh-cn/;
}
```

如果 proxy-pass 的地址包括/或其他路径，那么/some/path 将会被替换，如上所示，访问 http://localhost/some/path/page.html 将被代理到 http://localhost:8080/zh-cn/page.html。

## 动静分离

动静分离是指图片、css、js 等文件的请求直接由 nginx 返回响应，而不进行转发，减少宝贵的动态服务器资源占用。

有两种动静分离的方法，第一种是把静态文件手动放到一个目录里，以后的所有静态文件请求都指向这个目录。另一种是比较熟悉的，首次请求走动态服务器，并且把文件存在特定的目录，这样也是被缓存。第二种方式避免了手动和跨服务器操作，故推荐。

```
proxy_cache_path /var/cache/nginx/data keys_zone=mycache:10m;

server {

    listen 8001;
    server_name ruoyi.localhost;

    location / {
        #设置buffer
        proxy_buffers 16 4k;
        proxy_buffer_size 2k;
        proxy_pass http://localhost:8088;

    }


    location ~ \.(js|css|png|jpg|gif|ico) {
        #设置cache
        proxy_cache mycache;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404      1m;
        proxy_cache_valid any 5m;

        proxy_pass http://localhost:8088;
    }

    location = /html/ie.html {

        proxy_cache mycache;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404      1m;
        proxy_cache_valid any 5m;

        proxy_pass http://localhost:8088;
    }

    location ^~ /fonts/ {

        proxy_cache mycache;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404      1m;
        proxy_cache_valid any 5m;

        proxy_pass http://localhost:8088;
    }

}
```

proxy_cache_path 规定了缓存文件存放位置。keys_zone 作为标识供 location 引用。10m 表示缓存文件大小不超过 10m。location 中的 proxy_cache_valid 规定了缓存失效时间。

## 负载均衡

```
upstream ruoyi-apps {
    #不写，采用轮循机制
    ip_hash; #可确保来自同一客户端的请求将始终定向到同一服务器
    hash $request_uri consistent;
    server localhost:8080;
    server localhost:8088;

}

server {

  listen 8003;
  server_name ruoyi.loadbalance;

  location / {
    proxy_pass http://ruoyi-apps;
  }

}
```
