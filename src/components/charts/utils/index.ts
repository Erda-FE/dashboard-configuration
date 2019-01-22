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
        tempValue = convertFunction(value, '');
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

const convertFormatter = (value: string): string | Func => {
  try {
    // eslint-disable-next-line
    return (new Function(`return ${value}`))();
  } catch (error) {
    return '';
  }
};

export const convertFunction = (funcStr: string, testValue: any): string | Func => {
  try {
    const func = convertFormatter(funcStr);
    if (typeof func === 'function') {
      func(testValue);
      return func;
    }
    return '';
  } catch (error) {
    return '';
  }
};
