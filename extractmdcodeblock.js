const fs = require('fs');
const path = require('path');

// 定义读取文件的函数
const readMarkdownFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// 定义提取代码块的函数
const extractCodeBlocks = (markdown) => {
  const codeBlockRegex = /(```[\s\S]*?```)/g;
  return markdown.match(codeBlockRegex) || [];
};

// 定义主函数
const main = async () => {
    const filePath = path.join(__dirname, 'source/_posts/博客折腾记录-向轻量化目标挺进.md'); // 替换为你的Markdown文件路径
    console.log(filePath)
  try {
    const markdownContent = await readMarkdownFile(filePath);
    const codeBlocks = extractCodeBlocks(markdownContent);
    console.log('提取到的代码块:');
    codeBlocks.forEach((block, index) => {
      console.log(`代码块 ${index + 1}:`);
      console.log(block);
      console.log('------------------------');
    });
  } catch (err) {
    console.error('读取文件时出错:', err);
  }
};

// 执行主函数
main();
