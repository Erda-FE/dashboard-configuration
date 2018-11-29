/**
 * 应用版本简易生成
 * 1、所谓版本就是时间戳，因为Dice在前端不变更时进行打包，不会重新打包
 * 2、此方案并不能解决强制打包时或前端项目的非业务代码发生变更导致的Dice打包时，前端版本的变更情况
 */
const fs = require('fs');

const data = { version: Date.parse(new Date()) };

fs.writeFile('./public/version.json', JSON.stringify(data), (err) => {
  if (err) {
    console.log('version.json generated fail', err);
  } else {
    console.log('version.json generated ok.');
  }
});
