import { merge, set, cloneDeep, isString } from 'lodash';
import { getConfig } from '../../../config';
import { IViewConfig, IOptionFn, IStaticData } from '../../../types';


export function getOption(data: IStaticData, config: IViewConfig) {
  const defaultOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
    },
    series: [
      {
        name,
        type: 'pie',
      },
    ],
  };

  let option = defaultOption;
  let customOption;
  let customOptionFn = config.optionFn;
  if (customOptionFn) {
    if (isString(customOptionFn)) {
      customOptionFn = getConfig(['chartOptionFn', customOptionFn]) as IOptionFn;
      if (!customOptionFn) {
        customOptionFn = (d: any) => d;
        console.warn(`optionFn \`${customOptionFn}\` not registered yet`);
      }
    }
    customOption = customOptionFn(data, config.optionExtra);
  } else if (config.option) {
    customOption = config.option;
    if (isString(customOption)) {
      customOption = getConfig(['chartOption', customOption]);
      if (!customOption) {
        customOption = {};
        console.warn(`customOption \`${customOption}\` not registered yet`);
      }
    }
    customOption = cloneDeep(customOption) as any;
  }

  if (customOption) {
    option = merge(defaultOption, customOption);
  }

  const { metricData = [], legendData = [] } = data || {};
  if (legendData.length) {
    set(option, ['legend', 'data'], legendData);
  }
  merge(option, { series: metricData });
  return option;
}
