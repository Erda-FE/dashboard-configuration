/* 更新行政划分地区码
 * @Author: licao
 * @Date: 2020-10-26 11:03:42
 * @Last Modified by: licao
 * @Last Modified time: 2020-10-26 11:46:53
 */

const agent = require('superagent');
const fs = require('fs');
const path = require('path');

let initMapString = '';

// 获取行政区划 https://lbs.amap.com/api/webservice/guide/api/district/
agent.get('https://restapi.amap.com/v3/config/district')
  .query({
    key: 'fb7b54dfe3335e47bb086058338077d0',
    subdistrict: 2,
  })
  .then((res) => {
    const content = res.res.text;
    genADCodeMap(JSON.parse(content).districts);
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('获取行政区划异常:', err);
  });

const genADCodeMap = (districts) => {
  (function genInitMapString(data) {
    for (const { name, adcode, districts: _subDistricts } of data) {
      initMapString += `['${name}', '${adcode}'], `;
      if (_subDistricts.length) {
        genInitMapString(_subDistricts);
      }
    }
  }(districts));

  // 省市名不重复
  fs.writeFile(
    path.resolve(__dirname, '../src/constants/adcode-map.ts'),
    `export const adcodeMap = new Map([${initMapString}]);\r`,
    errHandler('adcode map')
  );
};

const errHandler = msg => (err) => {
  if (err) {
    console.log(`>>>>>> ${msg} generated fail! <<<<<< \n\n`, err);
  } else {
    console.log(`>>>>>> ${msg} generated ok. <<<<<<`);
  }
};
