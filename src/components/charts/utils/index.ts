import { forEach, startsWith, get, set, endsWith } from 'lodash';
import xss from 'xss';
// import { IChartsMap } from '../../../types';
import { panelSettingPrefix } from '../../utils';
import { Func } from 'echarts-for-react';

// 转化为option对象
export const convertSettingToOption = (drawerInfo: any): any => {
  const option = {};
  forEach(drawerInfo, (value, key) => {
    if (startsWith(key, panelSettingPrefix)) {
      const list = key.split('#');
      let tempValue = value;
      if (endsWith(key, 'formatter')) {
        tempValue = convertFormatter(value);
      }
      if (endsWith(key, 'enableLegend')) {
        tempValue = value;
      }
      if (endsWith(key, 'legend#position')) {
        set(option, ['legend', value], 0);
        return;
      }
      if (endsWith(key, 'legendMapping')) {
        try {
          tempValue = JSON.parse(value);
        } catch (error) {
          tempValue = {};
        }
      }
      set(option, list.splice(1, list.length - 1), tempValue);
    }
  });
  return option;
};

export const legendConvert = (sourceData: any[], settingOptions: any): any => {
  const enableLegend = get(settingOptions, 'legend.enableLegend');
  let legend = get(settingOptions, 'legend') || {};
  let convertedData = sourceData;
  if (enableLegend) {
    const mapping = legend.legendMapping || {};
    legend = {
      ...legend,
      data: sourceData.map((data: any) => {
        let legendName = data.label;
        if (mapping[legendName]) {
          legendName = mapping[legendName];
        }
        return legendName;
      }),
    };
    convertedData = sourceData.map((data: any) => {
      let legendName = data.label;
      if (mapping[legendName]) {
        legendName = mapping[legendName];
      }
      return { ...data, name: legendName };
    });
  }
  return { convertedOptions: { ...settingOptions, ...legend }, convertedData };
};

const convertFormatter = (value: string): string | Func => {
  try {
    // eslint-disable-next-line
    return (new Function(`return ${xss(value)}`))();
  } catch (error) {
    return '';
  }
};

