/**
 * @description 筛选篇幅过短的文章
 * @author jason
 */


const fs = require('fs');
const path = require('path');

const folderPath = './source/_posts'; 

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('无法读取文件夹内容：', err);
    return;
  }

  files.forEach((file) => {
    if (path.extname(file) === '.md') {
      const filePath = path.join(folderPath, file);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('无法读取文件内容：', err);
          return;
        }
        if (data.length < 500) {
          console.log(file);
        }
      });
    }
  });
});
