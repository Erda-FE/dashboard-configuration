import { forEach, startsWith, get, set, endsWith } from 'lodash';
import xss from 'xss';
import { panelSettingPrefix } from '../../utils';
import { Func } from 'echarts-for-react';

// 转化为option对象
export const convertSettingToOption = (drawerInfo: any): any => {
  const option = {};
  forEach(drawerInfo, (value, key) => {
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

const convertFormatter = (value: string): string | Func => {
  try {
    // eslint-disable-next-line
    return (new Function(`return ${xss(value)}`))();
  } catch (error) {
    return '';
  }
};

