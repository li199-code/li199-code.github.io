---
title: JWT认证
author: Jason Lee
date: 2023-05-08 19:33:25
tags: 
- authentication
- jwt
categories:
---

## 前言

各种认证方式一直是我头痛的点。奇怪的是，几乎所有的web开发教程都默认你已经会了，而不会专门教学，只是一笔带过。你只能自己去找博客看。参考[视频教程](https://www.youtube.com/watch?v=soGRyl9ztjI&ab_channel=JavaBrains)。

## 令牌（token)

这个词挺神奇的。transformer结构里有token这个概念，这里也有。不过他们的含义应该完全不同。在web开发中，token指的是令牌，或者凭证。

最开始，人们使用session+cookie的认证方式。这种情景下，服务器存储用户的相关信息，仅返回给浏览器一个session-id。浏览器下次请求，将在请求中的cookie中携带session-id，服务器接收到这个id，并且能查找到相关用户的信息，则认证成功。

但是这种模式越来越不适合当代多服务器的web模式。因为这相当于要求每个服务器都要存储一个用户信息表。所以，需要一种新的认证方式。

针对上述问题，一种解决方案是，不在服务器单独建用户信息表，而是将用户信息（token）存起来发给浏览器，浏览器下次来直接带完整的用户信息。然后，因为服务器这时候已经不存储任何用户信息，且所有信息完全来自用户，为了防止用户携带假信息进行欺诈，在发给浏览器的信息中加入签名进行防伪。

至于JWT的存储方式，可以是cookie，也可以是localstorage等。

## 实现方式

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16835504248481683550424778.png)

上图是jwt的结构。三段式，分别是头部、负荷和签名。头部有两个字段：生成签名用到的加密算法和token类型。负荷中的iat指的是issue at，签发时间。签名框里的意思是，头部加负荷，再加上密钥，一同经过sha256算法，生成了签名。

![](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16835498537981683549853156.png)

chatgpt的解释：

JWT的验证签名原理如下：

服务端在接收到JWT后，会对头部和载荷进行验证，验证包括以下几个步骤：

a. 解析出JWT中的头部和载荷，并检查头部中的算法是否为可信的算法。

b. 对头部和载荷使用相同的算法和密钥进行签名，得到签名结果。

c. 将服务端得到的签名结果和JWT中附带的签名结果进行比较，如果两个签名结果相同，则认为JWT是有效的，否则认为JWT是无效的。

通过以上验证过程，JWT的签名可以保证数据的完整性和真实性，从而确保JWT的安全性。值得注意的是，JWT并不加密，只是通过签名来验证数据的真实性和完整性，因此在使用JWT时，应该注意保护JWT的传输过程，避免JWT被篡改或窃取。

从上述可以得知，密钥是最关键的因素。

## simple-jwt的工作方式

ACCESS_TOKEN_LIFETIME 和 REFRESH_TOKEN_LIFETIME 是 djangorestframework-simple-jwt 中用于设置 JWT 令牌的生命周期的两个配置项。

具体来说，ACCESS_TOKEN_LIFETIME 设置了访问令牌的生命周期，而 REFRESH_TOKEN_LIFETIME 设置了刷新令牌的生命周期。在 JWT 认证过程中，当用户进行身份验证并且身份验证成功时，将使用这些生命周期配置项来生成新的 JWT 令牌并返回给用户。

访问令牌（Access Token）通常用于在客户端和服务器之间进行身份验证，并在较短的时间内过期。默认情况下，ACCESS_TOKEN_LIFETIME 的值为 5 分钟，但可以根据实际情况进行调整。

刷新令牌（Refresh Token）通常用于在访问令牌过期之后，用于获取新的访问令牌，以便用户继续使用应用程序而不必重新登录。默认情况下，REFRESH_TOKEN_LIFETIME 的值为 14 天，但也可以根据实际情况进行调整。

ROTATE_REFRESH_TOKENS: 如果为 True，每次使用刷新令牌获取新的访问令牌时，都会生成一个新的刷新令牌。默认为 False。

需要注意的是，虽然刷新令牌的生命周期相对较长，但是它的安全性也非常重要，因为它可以让攻击者获得访问令牌，并在用户不知情的情况下继续访问应用程序。因此，在配置刷新令牌生命周期时，需要权衡安全性和用户体验之间的平衡。

Access Token 和 Refresh Token 配合工作是通过以下方式实现的：

用户通过用户名和密码进行身份验证，验证成功后，服务器会颁发一个 Access Token 和一个 Refresh Token 给用户。
用户在每次请求时使用 Access Token 进行身份验证，如果 Access Token 未过期，则用户可以访问请求的资源。如果 Access Token 已过期，则用户需要使用 Refresh Token 获取新的 Access Token。
如果 Access Token 过期了，用户发送一个刷新令牌的请求，该请求包含 Refresh Token。(实际项目中，刷新一次页面，就会触发一次刷新token事件)
服务器验证 Refresh Token 是否有效和是否匹配，如果验证通过，则颁发一个新的 Access Token 并将其返回给用户，同时刷新 Refresh Token 的生命周期。
用户在下一次访问时使用新的 Access Token 进行身份验证，这个过程可以一直重复，直到 Refresh Token 过期或用户注销登录为止。
需要注意的是，为了确保安全性，Refresh Token 需要被妥善保管，以防止被其他人盗用。在使用 Refresh Token 时，建议将其存储在安全的地方，例如 HttpOnly Cookie 中，这样可以避免 XSS 攻击。另外，可以通过限制 Refresh Token 的使用次数和生命周期来增加安全性，例如限制 Refresh Token 只能在一定时间内使用一定次数。