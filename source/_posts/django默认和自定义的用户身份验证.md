---
title: django默认和自定义的用户身份验证
author: Jason Lee
date: 2023-05-10 09:16:20
tags: django
categories:
---

## 前言

在做项目时，身份验证是目前疑虑最多的地方：为什么这里要新建一个User模型？为什么要重写管理器？这篇文章通过查阅文档，尝试从最佳实践的角度给出答案。

## 默认验证方式

模型 视图函数 表单

注册 登录 登出

### 默认User模型

默认User模型主要包含以下字段：username、password、email、first_name、last_name。也就是说，如果有别的字段的需求（比如用户头像），就要自定义用户模型。目前暂不涉及权限，等到后续项目中接触到了，再添加。

### 视图函数

#### 注册

没有内置的注册视图，有内置的注册表单UserCreationForm。UserCreationForm的要求字段为用户名、邮箱和两次密码输入。

```
# views.py
class SignUpView(FormView):
    template_name = 'core/signup.html'
    form_class = forms.SignUpForm
    success_url = '/login/'

    def form_valid(self, form):
        form.save()
        return super().form_valid(form)

# forms.py
class SignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    username = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Your username',
        'class': 'w-full py-4 px-6 rounded-xl'
    }))
    email = forms.CharField(widget=forms.EmailInput(attrs={
        'placeholder': 'Your email address',
        'class': 'w-full py-4 px-6 rounded-xl'
    }))
    password1 = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Your password',
        'class': 'w-full py-4 px-6 rounded-xl'
    }))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Repeat password',
        'class': 'w-full py-4 px-6 rounded-xl'
    }))
```

#### 登录

有内置视图LoginView，有内置的表单AuthenticationForm

```
# forms.py
class LogInForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Your username',
        'class': 'w-full py-4 px-6 rounded-xl'
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Your password',
        'class': 'w-full py-4 px-6 rounded-xl'
    }))

# urls.py
path('login/', auth_views.LoginView.as_view(template_name='core/login.html', authentication_form=LogInForm), name='login'),

# settings.py
LOGIN_REDIRECT_URL = '/'
```

#### 登出

有内置视图LogoutView，无需视图

```
# urls.py
path('logout/', auth_views.LogoutView.as_view(), name='logout')

# settings.py
LOGOUT_REDIRECT_URL = '/'
```

## 自定义验证方式

有两个可以自定义的地方：认证后端和User模型

### 认证后端

前面提到的authenticate和login方法都是django默认认证后端提供的。

### User模型

一般有两个需要扩展：模型本身和管理器（manager）

```
# models.py

class CustomUserManager(UserManager):
    def _create_user(self, name, email, password, **extra_fields):
        if not email:
            raise ValueError("You have not provided a valid e-mail address")

        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, name=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(name, email, password, **extra_fields)

    def create_superuser(self, name=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(name, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=True, default='')
    avatar = models.ImageField(upload_to='avatars', blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []
```

