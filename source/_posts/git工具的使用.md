---
title: git工具的使用
date: 2023-01-23 11:04:29
tags: git
categories:
---

## 前言

实习过程中，大量使用 git。放假前，同事提出，我提交的版本覆盖了他的。为了能在节后解决问题，顺便对 git 工具体系做一个彻底的复习，写下此文。

## 初始化

git 是一种分布式管理工具。它能实现多人共同维护一个工程文件。下载好 git，并配置好身份信息后，可以有两种方式开始 git: 一种是下载 git 仓库，一种是在本地执行 `git init` 。这两种方式执行后，文件夹里都会有一个 `.git` 文件夹。

git config 相关命令配置仓库，[这篇文章](https://zhuanlan.zhihu.com/p/76467410#:~:text=%E4%B8%80%E3%80%81%20git%20config%E7%AE%80%E4%BB%8B%201%201.%E4%BB%93%E5%BA%93%E7%BA%A7%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%EF%BC%9A%20%E6%96%B9%E6%B3%951%EF%BC%9A%E6%89%BE%E5%88%B0%E8%AF%A5%E6%96%87%E4%BB%B6%EF%BC%8C%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%EF%BC%9A%20%E8%AF%A5%E6%96%87%E4%BB%B6%E4%BD%8D%E4%BA%8E%E5%BD%93%E5%89%8D%E4%BB%93%E5%BA%93%E4%B8%8B%EF%BC%8C%E8%B7%AF%E5%BE%84.git%2F%EF%BC%8C%E6%96%87%E4%BB%B6%E5%90%8D%E4%B8%BAconfig%20%E8%BF%99%E4%B8%AA%E9%85%8D%E7%BD%AE%E4%B8%AD%E7%9A%84%E8%AE%BE%E7%BD%AE%E5%8F%AA%E5%AF%B9%E5%BD%93%E5%89%8D%E6%89%80%E5%9C%A8%E4%BB%93%E5%BA%93%EF%BC%88H%3A%5CMyGit%E7%9B%AE%E5%BD%95%E4%B8%8B%E7%9A%84test%E4%BB%93%E5%BA%93%EF%BC%89%E6%9C%89%E6%95%88%EF%BC%8C%E4%BB%93%E5%BA%93%E7%BA%A7%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6%E5%86%85%E5%AE%B9%E5%A6%82%E4%B8%8B%EF%BC%9A,%E6%96%B9%E6%B3%951%EF%BC%9A%20%E6%9C%AC%E5%9C%B0git%E7%9A%84%E5%AE%89%E8%A3%85%E7%9B%AE%E5%BD%95%E4%B8%8B%EF%BC%8C%E4%BB%A5%E6%88%91%E7%9A%84git%E5%AE%89%E8%A3%85%E8%B7%AF%E5%BE%84%E4%B8%BA%E4%BE%8B%EF%BC%9AF%3A%5Csoftware%5CGit%5Cmingw64%5Cetc%EF%BC%8C%E6%96%87%E4%BB%B6%E5%90%8D%E4%B8%BA%EF%BC%9Agitconfig%EF%BC%8C%E5%86%85%E5%AE%B9%E5%A6%82%E4%B8%8B%EF%BC%9A%20%E6%96%B9%E6%B3%952%EF%BC%9A%20%E9%80%9A%E8%BF%87%E5%91%BD%E4%BB%A4%E6%9F%A5%E7%9C%8B%E7%B3%BB%E7%BB%9F%E9%85%8D%E7%BD%AE%EF%BC%9Agit%20config%20--system%20-l%20)介绍得很详细了。总体来说，git 配置分为三个层次：仓库级（local）、用户级（global）、系统级（system）。配置的优先级是仓库->用户->系统。`git config -l`可以将当前仓库的所有可用配置列举出来，如下：

```plaintext
diff.astextplain.textconv=astextplain
filter.lfs.clean=git-lfs clean -- %f
filter.lfs.smudge=git-lfs smudge -- %f
filter.lfs.process=git-lfs filter-process
filter.lfs.required=true
http.sslbackend=openssl
http.sslcainfo=C:/Program Files/Git/mingw64/ssl/certs/ca-bundle.crt
core.autocrlf=true
core.fscache=true
core.symlinks=false
pull.rebase=false
credential.helper=manager-core
credential.https://dev.azure.com.usehttppath=true
init.defaultbranch=master
filter.lfs.clean=git-lfs clean -- %f
filter.lfs.smudge=git-lfs smudge -- %f
filter.lfs.process=git-lfs filter-process
filter.lfs.required=true
user.name=li199-code
user.email=
http.sslverify=false
credential.http://git.zhi-shan.cn.provider=generic
credential.https://gitee.com.provider=generic
core.repositoryformatversion=0
core.filemode=false
core.bare=false
core.logallrefupdates=true
core.symlinks=false
core.ignorecase=true
remote.origin.url=http..
remote.origin.fetch=+refs/heads/*:refs/remotes/origin/*
branch.master.remote=origin
branch.master.merge=refs/heads/master
user.name=
user.email=
```

我现在有一个需求，要修改提交时的姓名和邮件：

```git
git config --local --add user.name jason
git config --local --add user.email 111@qq.com
```

## git 提交

可以理解有两种提交：一种提交到本地的 git 区，一种是在本地提交后，提交到远程仓库，即 push。

`git status`查看本地有哪些修改。`git log`查看提交日志。`git checkout [hashcode]`根据某次提交的哈希值将代码回滚。

## branch 分支（时间线）

`git branch [name]`创建分支。新分支会继承主分支上的所有历史改动，类似于时间线的概念。

一般来说，其他分支是在主分支基础上的重大更新，如果要合并其他分支，需要在切换到主分支后，执行 `git merge [name]`.

## git checkout

`git checkout [id] filepath` 用于回滚时，最好加上要回滚的文件名，这样只会改变该文件，而不会专门进入detached head模式。

> "Detached HEAD"是一个Git术语，用来描述HEAD指针在一个特定的提交版本上，而不是指向任何分支的状态。这种状态下，你处于一个游离的、临时的工作环境，没有与之关联的分支。
> 
> 当你切换到一个特定的提交版本（通过提交哈希、标签或分支名）而不是一个分支时，Git会将HEAD指针直接指向该提交。这就是所谓的"Detached HEAD"状态。
> 
> Detached HEAD状态通常用于以下情况：
> 
> 查看历史提交：你可以在Detached HEAD状态下查看、比较和分析以前的提交。这对于浏览代码历史、调试问题或查找特定更改非常有用。
> 
> 临时工作：如果你想在不影响当前分支的情况下进行一些临时的更改或实验，可以切换到Detached HEAD状态。你可以在该状态下创建新的提交，但这些提交不会属于任何分支。

## git remote

以上说的操作都是在本地完成的。如何将本地改好的代码，传到云端完成多人协同开发呢？

如果是本地初始化 git，在 git push 之前，需要配置文章仓库的 url:

```powershell
git remote add <name> <url>
```

`<name>`是 url 的别名，毕竟 url 很长。默认为 origin。同时，本地 git 文件夹里的 ref 下，也会创建 origin 文件夹，存缓存数据。

```powershell
git push origin master
```

## 其他问题

为什么实习连的公司内部 gitlab 仓库，不用像 github 那样配置 ssh？

因为 git 远程仓库有两种方式，ssh 登录和 https 登录，而我是通过输入账号密码登录的，属于后者。且 windows credential helper 帮我记下了 git 仓库的账号和密码（一台主机可以储存多种仓库的账号，比如 github，gitlab），避免每次提交代码需要重复输入。

## vscode git 工作流

首先，正确的工作流是：add -> commit -> pull -> push。在 vscode 中，commit -> pull -> push 简化为一个按钮：`commit & sync`.

附上一篇[文章]()，解释为什么需要先 pull 后 push。

## git状态（更新）

![16872235086311687223508501.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16872235086311687223508501.png)

这张图展示了git的四种状态：untracked, unmodified, modified, staged. 从指向每个状态的箭头，我解读出一些有用的信息。首先，`git init`命令执行，创建了一个“容器”，但是所有的文件依旧是untracked. staged要么是从untracked转来，要么是已经被跟踪的文件被修改后执行`git add`而来。stage状态的文件被commit后，状态就会回到unmodified。
