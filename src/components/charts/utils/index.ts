import { forEach, startsWith, set } from 'lodash';
import { IChartsMap } from '../../../types';
import { panelSettingPrefix } from '../../utils';

// 转化为option对象
export const convertSettingToOption = (drawerInfo: any): IChartsMap => {
  const option = {};
  forEach(drawerInfo, (value, key) => {
    if (startsWith(key, panelSettingPrefix)) {
      const list = key.split('#');
      set(option, list.splice(1, list.length - 1), value);
    }
  });
  return option;
};

