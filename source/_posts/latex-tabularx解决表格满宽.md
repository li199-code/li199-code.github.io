---
title: latex tabularx解决表格满宽
date: 2023-02-22 21:51:43
tags: latex
categories: 硕士论文
---

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
