---
title: latex overleaf 生僻字处理方案
date: 2023-02-12 23:23:38
tags: latex
categories:
---

用 overleaf 写大论文时候，有一个作者的名字带生僻字：“赟”，overleaf 会显示为“F”。解决方案如下：

在 usepackage 区里，添加以下代码：

```latex
\usepackage{ctex}
\setCJKfamilyfont{myfont}{BabelStone Han}
\newcommand{\MyFont}{\CJKfamily{myfont}}
```

意思是添加一个自定义指令，专门用某个可以正常显示生僻字的字体，这里是 BabelStone Han。

然后在正文处：

```
{\MyFont{赟}}
```

就可以正常显示了！
