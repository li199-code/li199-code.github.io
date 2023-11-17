---
title: "Django ORM记录"
date: 2022-11-24 11:22:00
tags:
  - django
---

记录曾经不懂的问题和踩过的坑

<!-- more -->

## choices

Django 模型中的字段有个 choices 属性，这个属性可以提供被选数据。如果一个字段设置了这个属性,在模版中如果我要显示这个字段，那么 django 模版系统就会将它默认解析为一个下拉菜单。

```python
# models.py
choices = (
		(1, '男'), (2, '女'), (3, '其他')
)
gender = models.IntegerField(choices=choices)
```

```html
# html {{ obj.get_gender_display }}
##在模板中，为了获取元组中id对应值，用左边的语法
```

## 外键

```python
#model.py

## 外键要关联的表
class department(models.Model):
	name = models.CharField(max_length=32)

	## 在结合modelForm时，若for循环输出，下面语句可避免bug
	def __str__(self):
		return self.name


department = models.ForeignKey(to='department', on_delete=models.CASCADE)
## 外键关联上后，执行迁移，会在本表创建一个名为'department_id'字段。
```

```html
# html {{ obj.department.name }} ##department字段会返回一个department表的对象
```

## modelForm

### 添加数据

当想让用户向已有数据库中添加新的数据，应该用 modelForm 来创建一个对象。这个对象可以用 for 循环来在模板中显示字段，而且具有自动对数据进行校验和报错功能。

```python
## views.py

class employModelForm(forms.ModelForm):
	## 默认校验非空，可以对数据进行个性化校验，如：
	## password = forms.CharField(min_length=3, label='密码')
	class Meta:
		model = employee
		fields = "__all__"

def add(req):
	if req.method == 'GET':
		# form = employeeForm()
		form = employModelForm()
		return render(req, 'emp_add.html', {'form': form})

	form = employModelForm(data=req.POST)
	if form.is_valid():
		form.save()
		return redirect('/emp/list/')

	## 数据校验失败，将已输入的信息和产生的错误提示返回给页面
	return render(req, 'emp_add.html', {'form': form})
```

```html
{{field.label}}: {{ field }} {{ field.errors.0 }} //错误信息输出
```

### 修改数据

修改数据时，要告诉 django 修改的对象是哪个。

```python
## views.py
form = employModelForm(data=req.POST, instance=obj)
```
