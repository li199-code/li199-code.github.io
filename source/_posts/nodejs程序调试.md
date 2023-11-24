---
title: nodejs程序调试
date: 2023-11-23 10:22:54
updated: 2023-11-23 10:22:54
tags: nodejs
categories:
---

一种是在浏览器中调试，另一种是在 vscode 中调试。

> test

## 浏览器

`node --inspect-brk`命令用于启动 Node.js 调试器，并在脚本的第一行设置一个断点，以便在调试器启动后立即暂停执行。

以下是使用`node --inspect-brk`进行调试的步骤：

1. 打开终端，并导航到你的项目目录。

2. 运行以下命令来启动调试器并设置断点：

   ````
   node --inspect-brk your-script.js
   ```

   这里的`your-script.js`是你要调试的Node.js脚本文件。

   ````

3. Node.js 将会启动调试器并在脚本的第一行设置断点。你将看到类似以下的输出：

   ````
   Debugger listening on ws://127.0.0.1:9229/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   For help, see: https://nodejs.org/en/docs/inspector
   ```

   ````

4. 打开一个支持 Chrome 开发者工具协议的浏览器（如 Google Chrome）。

5. 在地址栏中输入`chrome://inspect`，然后按下回车键。

6. 在页面上的"Remote Target"部分，你应该能够看到你正在调试的 Node.js 脚本。

7. 点击"inspect"链接，将打开开发者工具面板。

8. 在开发者工具面板中，你可以查看调试器的各种选项，例如调用栈、变量的值、执行表达式等。

9. 你可以使用“Resume script execution”按钮继续执行脚本，也可以使用其他调试工具来控制调试器的行为。

10. 当你完成调试时，关闭浏览器选项卡，或者在终端中使用`Ctrl + C`两次来停止 Node.js 调试器。

使用`node --inspect-brk`命令启动调试器后，它将在脚本的第一行暂停，以便你可以检查和调试代码。你可以使用浏览器中的开发者工具来查看和操作调试器。

如果不想从头开始调试，可以在程序要打断点处加上 debugger。

## vscode

点击界面左边的第四个 DEBUG 按钮，进入调试界面，然后点击界面上方“No Configuration”下拉菜单，选择“Add Configuration”。

选择 Node.js 环境。选择完成之后，在项目的根目录中会生成一个 .vscode 的目录，这个目录中存放了各种各样的 VSCode 的配置。现在这个目录中就包含了一个文件名为 lanuch.json 的配置文件。

断点标记好后，就可以开始执行程序了。由于我们要程序在断点处停下来，所以要以 Debug 模式启动程序。

现在我们回到 VSCode 调试面板，点击顶部绿色的“执行”按钮，VSCode 就以调试模式启动程序了。可以看到，会新建一个 JavaScript debug console。输入 node app.js 就可以调试了。
