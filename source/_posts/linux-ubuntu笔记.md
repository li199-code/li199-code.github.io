---
title: linux ubuntu笔记
author: Jason Lee
tags: linux
abbrlink: be5075f5
date: 2023-07-10 19:43:44
categories:
---

## 前言

跟随全栈学习路线之 linux 系统熟悉。由于 linux 的命令很多，且有些命令很长，很难记住，但是借助 gpt，无需强调记住命令，而是重点学习 linux 系统的工作原理，以及和 win 系统不同的操作逻辑。

另外，docker 也是基于 linux 系统。

## directory

删除某一个文件夹时，如果文件夹下有文件，是不能直接删除的，得用`rm -r <directory>`. -r 表示递归的删除，即将所有存在的文件全部删除。

## file

复制粘贴文件时，并不是像 win 下有分为 copy&paste 两个动作，而是一个命令完成：`cp <src> <tar>`. 如果要将整个文件夹下的文件复制到另一个地方，要分两种情况，要么是所有文件的转移：`cp -r . <tar>` 或者以文件夹的形式复制：`cp -r <dirname> <tar>`.

mv 命令从字面上是移动（剪切粘贴），也可作为重命名文件的命令使用

## file content

cat 是一个神奇的命令，可以实现文件的创建和查看功能。注意，cat 不能用于文件的修改，因为 cat 一旦修改了一个已经存在的文件，就会把已有的内容全部删除，相当于新建文件。

创建文件：`cat filename`, 会进入编辑模式，输入完毕后，按`crtl+d`保存。

在命令行内查看文件：cat 命令会将所有的内容全部打印在命令行窗口。但是，如果文件内容较多，很容易看花眼，我喜欢加一个修饰符来添加行号，使得阅读更容易：`cat <file> -b`. 另外，cat 还可以将多个文件的内容同时打印，或者输入到一个新的文件中：`cat file1.txt file2.txt>all.txt`. 这是 win 中没有的功能。

虽然上面的`cat <file> -b`可以看一些大文件，但如果文件的行数真的很大，仍然不太方便。针对大文件的查看，应该用`more file`, 分页显示，翻页用 space 键。

## file structure

win 的所有文件都存在 C 盘（假如不分区），而 linux 的根目录则是朴实无华的`/`，类似于 C 盘。

## system info

win 通过任务管理器，可以得知系统的所有实时信息：磁盘、处理器、进程等。如果要在 linux 的命令行窗口中获得实时信息，可以用 top 或者 htop 命令：

top 的输出：
![](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/16891288146221689128813983.png)

htop 的输出：
![](https://cdn.jsdelivr.net/gh/li199-code/blog-imgs@main/16891288816201689128881589.png)

htop 的信息更清晰一些。

## package manager

windows 下所有的软件安装都是走可视化窗口，而 ubuntu 一般都是通过命令行。搜索软件：`sudo apt search <name>`, 安装：`sudo apt install <name>`, 卸载：`sudo apt remove <name>`。

或者，也有的软件是通过下载压缩包，并解压后得到 deb 后缀的安装包，运行`sudo dpkg -i <name>`.

注意：软件安装都需要 sudo 的权限，因为安装过程都是对系统文件的修改。

## text editor

nano 在我心中取代了 vim，因为它的操作逻辑更简单直观。
