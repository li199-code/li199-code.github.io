---
title: 动手pytorch
date: 2023-03-21 10:18:17
tags: deep-learning
categories: 动手pytorch
---

这个系列记录我跟随 B 站上李沐的《动手学深度学习》的视频教程。每五个章节的笔记合成一篇 blog。

## 安装环境

我的学习平台时 win11, powershell, anaconda

```
conda create -n d2l-zh python=3.8
conda activate d2l-zh
pip install jupyter d21 torch torchvision
jupyter notebook
```

激活了 jupyter notebook。可以实时演示效果，适合初学时做一些 demo。

### bug fix

使用 powershell 时，出现了红字错误：

```
. : File C:\Users\lfy\Documents\WindowsPowerShell\profile.ps1 cannot be loaded because running scripts is disabled on t
his system. For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char:3
+ . 'C:\Users\lfy\Documents\WindowsPowerShell\profile.ps1'
+   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

询问 chatgpt 后，这是 powershell 设立的脚本运行安全策略。解决方案是：

```
Set-ExecutionPolicy RemoteSigned
```
