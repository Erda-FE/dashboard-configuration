import { forEach, startsWith, get, set, endsWith } from 'lodash';
// import xss from 'xss';
import { panelSettingPrefix } from '../../utils';
import { Func } from 'echarts-for-react';


// 转化为option对象
export const convertSettingToOption = (drawerInfo: any): any => {
  const option = {};
  forEach(drawerInfo, (value, key) => {
    if (value === undefined || value === '') {
      return;
    }
    if (startsWith(key, panelSettingPrefix)) {
      const list = key.split('#');
      let tempValue = value;
      if (endsWith(key, 'axisLabel#formatter')) {
        tempValue = convertFormatter(value);
        if (typeof tempValue !== 'function') {
          return;
        }
      } else if (endsWith(key, 'formatter') || endsWith(key, 'legend#data')) {
        tempValue = convertFormatter(value);
      }
      set(option, list.splice(1, list.length - 1), tempValue);
    }
  });
  return option;
};

export const convertFormatter = (value: string): string | Func => {
  try {
    // eslint-disable-next-line
    return (new Function(`return ${value}`))();
  } catch (error) {
    return '';
  }
};

export const funcValidator = (_rule: any, value: string, callback: any) => {
  if (!value) {
    callback();
  }
  const func = convertFormatter(value);
  if (typeof func === 'function') {
    callback();
  } else {
    callback('请输入正确函数体');
  }
};

