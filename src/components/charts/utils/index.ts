import { endsWith, forEach, reduce, set, startsWith } from 'lodash';
// import xss from 'xss';
import { panelSettingPrefix, strToObject } from '../../utils';

import { Func } from 'echarts-for-react';

// drawerInfo转化为option对象
export const convertSettingToOption = (drawerInfo: any): any => {
  const option = {};
  forEach(drawerInfo, (value, key) => {
    if (value === undefined || value === '') {
      return;
    }
    if (startsWith(key, panelSettingPrefix)) {
      const list = key.split('#');
      let tempValue = value;
      if (endsWith(key, 'formatter') || endsWith(key, 'legend#data')) {
        tempValue = convertFormatter(value);
      }
      set(option, list.splice(1, list.length - 1), tempValue);
    }
  });
  return option;
};

// option转化为drawerInfo对象
const whiteList = ['boolean', 'string'];
const convertOption = (object: object) => reduce(object, (result: object, val: any, key: string): object => {
  if (typeof val === 'object') {
    const obj = convertOption(val) as any;
    forEach(obj, (val1, key1) => {
      result[`${key}#${key1}`] = whiteList.includes(typeof val1) ? val1 : val1.toString();
    });
  } else {
    result[key] = val;
  }
  return result;
}, {});

export const convertOptionToSetting = (option: any): any => {
  const settingInfo = {};
  forEach(convertOption(option), (val1, key1) => {
    settingInfo[`${panelSettingPrefix}${key1}`] = val1;
  });
  return settingInfo;
};

export const convertFormatter = (value: string): string | Func => {
  try {
    return strToObject(value);
  } catch (error) {
    return value;
  }
};

export const funcValidator = (_rule: any, value: string, callback: any) => {
  if (!value) {
    callback();
    return;
  }
  const func = convertFormatter(value);
  if (typeof func === 'function') {
    callback();
  } else {
    callback('请输入正确函数体');
  }
};

