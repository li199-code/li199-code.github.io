---
title: typescript文件造成win文件夹卡顿原因及解决方案
author: Jason Lee
date: 2023-08-09 09:43:24
tags: typescript
categories:
---

写了好几天的 ts 代码，发现打开包含 ts 代码的文件夹时，文件夹会缓慢刷新，而且不是列表形式展示。非常痛苦:(

一开始以为是 windows11 的 bug，后来一想，最开始新建 ts 代码时，win11 直接把它当成视频文件，会不会和这个有关系。所以就用 google 搜了这个问题，果然，只有第一个搜索结果给出了问题原因和解决方案。正如所预料的，win11 把 ts 文件默认成视频文件，每次展示都要刷新。办法就是修改注册表，使系统默认 ts 为文本文档。新建`.reg`文件：

```
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\.ts]
@="txtfile"
"Content Type"="text/plain"
"PerceivedType"="text"

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\KindMap]
".ts"="document"
```

双击即修改完成。

参考：
https://www.cnblogs.com/himeka/p/16306947.html

**另外，我发现只有 google 能搜到上述解决方案，bing 和 baidu 都不行。现在知道用谁了吧...**
