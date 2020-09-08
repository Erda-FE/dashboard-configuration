import { merge, set, cloneDeep, isString } from 'lodash';
import { getConfig } from '../../../config';


export function getOption(data: DC.StaticData, config: DC.ChartConfig) {
  const defaultOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      x: 'right',
      y: 'center',
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
      customOptionFn = getConfig(['chartOptionFn', customOptionFn]) as DC.OptionFn;
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
    if (data.extraOption) {
      customOption = merge(customOption, data.extraOption);
    }
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
