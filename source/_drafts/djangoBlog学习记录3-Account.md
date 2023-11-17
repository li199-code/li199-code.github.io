---
title: djangoBlog学习记录3 - Account
date: 2022-12-15 15:58:29
tags:
categories: djangoBlog
---

```
accounts
 ├── admin.py
 ├── apps.py 
 ├── forms.py
 ├── migrations
 ├── models.py
 ├── templatetags
 ├── tests.py
 ├── urls.py
 ├── user_login_backend.py // 自定义认证后端，取代默认的ModelBackend
 ├── utils.py
 └── views.py
```

<br/>

#### settings.py有关认证模块的配置

1. AUTHENTICATION_BACKENDS

自定义认证后端，取代默认的ModeBackend，实现某些特殊需求，比如对邮件的验证

AUTHENTICATION_BACKENDS = [
    'accounts.user_login_backend.EmailOrUsernameModelBackend']

2. AUTH_USER_MODEL

Django 允许在 settings.py 文件中定义 AUTH_USER_MODEL 覆盖默认的 auth.User，以满足特定项目的需求。

3. AUTH_PASSWORD_VALIDATORS

对密码复杂程度的校验，默认有四种，可以创建更复杂的规则。
