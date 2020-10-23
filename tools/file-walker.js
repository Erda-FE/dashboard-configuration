const fs = require('fs');
const path = require('path');

// 标记结束点
let files = 0;
const walker = ({ root, dealFile, recursive = true }) => {
  if (!dealFile) {
    throw new Error('没有指定文件处理方法');
  }
  fs.readdir(root, 'utf8', (err, data) => {
    if (err) {
      console.log(`读取 ${root} 目录错误:`, err);
      return;
    }
    data.forEach((item) => {
      // 过滤隐藏目录
      if (item.startsWith('.')) {
        return;
      }
      const subPath = path.resolve(`${root}/${item}`);
      if (!item.includes('.') && recursive) {
        // console.log('目录:', item);
        return walker({ root: subPath, dealFile, recursive });
      }
      const filePath = subPath;
      files += 1;
      fs.readFile(filePath, 'utf8', (readErr, content) => {
        if (readErr) {
          console.error(`读取文件 ${filePath} 错误:`, readErr);
          return;
        }
        dealFile(content, filePath, files === 1);
        files -= 1;
      });
    });
  });
};

module.exports = {
  walker,
};
