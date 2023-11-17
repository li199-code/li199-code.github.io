---
title: djangoBlog学习记录4 - Admin
date: 2022-12-15 15:58:29
tags:
categories: djangoBlog
---


### modelAdmin 自定义后台管理

articleAdmin是用来管理后台模型的展示方式的：

```python
class ArticlelAdmin(admin.ModelAdmin):
    list_per_page = 20 ## 分页
    search_fields = ('body', 'title') ## 搜索框
    form = ArticleForm
    list_display = (
        'id',
        'title',
        'author',
        'link_to_category',
        'created_time',
        'views',
        'status',
        'type',
        'article_order') ##定制哪些字段需要展示
    list_display_links = ('id', 'title')
    ## 过滤选项
    list_filter = (ArticleListFilter, 'status', 'type', 'category', 'tags')
    filter_horizontal = ('tags',)
    exclude = ('created_time', 'last_mod_time')
    view_on_site = True
    actions = [
        makr_article_publish,
        draft_article,
        close_article_commentstatus,
        open_article_commentstatus]

    def link_to_category(self, obj):
        info = (obj.category._meta.app_label, obj.category._meta.model_name)
        link = reverse('admin:%s_%s_change' % info, args=(obj.category.id,))
        return format_html(u'<a href="%s">%s</a>' % (link, obj.category.name))

    link_to_category.short_description = '分类目录'

    def get_form(self, request, obj=None, **kwargs):
        form = super(ArticlelAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['author'].queryset = get_user_model(
        ).objects.filter(is_superuser=True)
        return form

    def save_model(self, request, obj, form, change):
        super(ArticlelAdmin, self).save_model(request, obj, form, change)

    def get_view_on_site_url(self, obj=None):
        if obj:
            url = obj.get_full_url()
            return url
        else:
            from djangoblog.utils import get_current_site
            site = get_current_site().domain
            return site
```

在settings.py中，将用户模型由默认的auth.User设置为account.BlogUser

```python
AUTH_USER_MODEL = 'accounts.BlogUser'
```

这样，django就不会生成自带的auth_user表。

默认的user表(继承自AbstractUser)含有的字段包括：

![截图](attachment:4da533e7ca03bbd477cf473c4996c470)

<br/>

## djangoBlog admin_site.py

```
from django.contrib.admin import AdminSite

class DjangoBlogAdminSite(AdminSite):
    site_header = 'djangoblog administration' ## 放在每个管理页面顶部的文字
    site_title = 'djangoblog site admin' ## <title>,标签页名字

    def __init__(self, name='admin'):
        super().__init__(name)

    def has_permission(self, request):
        return request.user.is_superuser
      
admin_site = DjangoBlogAdminSite(name='admin')
```

admin_site和auth.admin平级，是一个admin实例。AdminSite用于自定义admin。
