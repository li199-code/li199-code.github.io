---
title: latex奇怪bug解决方案
date: 2023-02-12 23:23:38
tags: latex
categories:
---

# latex overleaf 生僻字处理方案

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

# latex 清除浮动来消除大片空白

## 问题描述

虽然 latex 是自动排版，但是偶尔会出现明明可以放下内容的地方，被留下空白。通常是发生在多个表格或者图片相连，然后后面跟着文字，文字和最后一个图表之间就会分页。

## 解决方案

最简单的，先从垂直间距开始调起。`\vspace{-1cm}`。但是可能不起效果，比如本文提到的情景。

或者是清除浮动。浮动的含义是，图表的位置并不固定在源码的位置，而可能被放置在上下几页，具体取决于 latex 算法认为美观的地方。在我这种情况中，显然是 latex 的算法自动排列的算法不符合真正的美观，所以要手动取消浮动，并且人工微调。取消浮动的方式是引入下列的包：

```
\usepackage[section]{placeins} 避免浮动体跨过 \section
```

```
\usepackage{float} 禁止浮动
% ...
\begin{figure}[H]
% ...
\begin{table}[H]
% ...
```

幸运的是，取消浮动后，一张表占据一整页的现象消失了，而且位置刚好，没有出现大面积空白。

> 参考: https://www.zhihu.com/question/25082703

# tabularx 解决表格满宽

需求：让表格宽度等于页面宽度，单元格列宽可以指定，单元格文字居中。

解决方案：tabularx 是 tabular 的增强版，可以指定表格总体所占宽度，设置步骤如下：

1. 在导言区导入 tabularx 包，并设置自适应宽度和指定宽度两种列选项，使得文字可以居中（默认是左对齐）

```
\usepackage{tabularx}
\usepackage{array}
\usepackage{ragged2e}
% 该命令用于控制 p{} 的情况
\newcolumntype{P}[1]{>{\RaggedRight\hspace{0pt}}p{#1}} % 使用过程中，将p{4cm}换成P{4cm}，小写改成大写即可！
% 该命令用于控制 X 的情况
\newcolumntype{Z}{>{\centering\let\newline\\\arraybackslash\hspace{0pt}}X} % 使用过程中，将Z 换成 X，即可！
\let\oldtabularx\tabularx
\renewcommand{\tabularx}{\zihao{5}\oldtabularx}

% 可利用 RaggedLeft Centering替换RaggedRight，实现靠右和居中 [代码对大小写敏感！！！！！！！！！！！！！！！！！！！！！！！！！！！！]
```

其中，p 表示指定宽度，X 表示自适应，也就是均分宽度。

2. 在表格区域内使用方式：

```
\begin{table}[h!]
    \centering
    \caption{DICM、LIME、MEF、NPE数据集上的平均NIQE值} \label{dwtqrcp_niqe}
    \begin{tabularx}{\textwidth}{ZZZZZ}
    data
\end{tabularx}
\end{table}
```

\begin{tabularx}{\textwidth}{ZZZZZ} 第二个选项指定整体宽度，第三个是列选项。
