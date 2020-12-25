/* 更新 icon
 * @Author: licao
 * @Date: 2020-10-26 11:02:00
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-24 16:10:48
 */

const fs = require('fs');
const agent = require('superagent');

const iconUrl = '//at.alicdn.com/t/font_2032442_i2ebv26geme.css';
const reg = /\.dc-icon-([a-zA-Z-_]+):before /g; // match dc-icon-(xxx)

const errHandler = msg => (err) => {
  if (err) {
    console.log(`${msg} generated fail`, err);
  } else {
    console.log(`${msg} generated ok.`);
  }
};

agent.get(`https:${iconUrl}`).then((res) => {
  const content = res.res.text;
  // 写入icon css
  fs.writeFile('./src/static/iconfont.css', content, errHandler('iconfont'));
  // 生成Icon type
  const matchList = Array.from(content.matchAll(reg)).map(m => m[1]);
  fs.writeFile(
    './src/types/iconfont.d.ts',
    `type DcIconType = ${matchList.map(i => `'${i}'`).join(' | ')};
`, // left new empty line
    errHandler('iconfont type')
  );
}).catch(err => console.log(err));
