import { merge, set, cloneDeep, isString } from 'lodash';
import { getConfig } from '../../../config';
import { IViewConfig, IOptionFn } from '../../../types';

type TData = number[] | string[];
type IMetric = {
  type: string;
  name: string;
  data: TData[];
};
export interface IData {
  xData: TData[];
  yData: TData[];
  metricData: IMetric[];
}


export function getOption(data: IData, config: IViewConfig) {
  const defaultOption = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: [{
      type: 'category',
      data: [],
    }],
    yAxis: [{
      type: 'value',
    }],
    series: [{
      data: [],
      type: 'line',
    }],
    grid: {
      left: 40,
      right: 40,
      bottom: 40,
    },
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
    customOption = customOptionFn(data);
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
    // 对用户的配置做些格式处理
    let { xAxis, yAxis } = customOption;
    // 横纵轴都用数组形式
    xAxis = Array.isArray(xAxis) ? xAxis : [xAxis];
    yAxis = Array.isArray(yAxis) ? yAxis : [yAxis];
    option = merge(defaultOption, { ...customOption, xAxis, yAxis });
  }

  // eslint-disable-next-line prefer-const
  let { xData = [], yData = [], metricData = [], legendData = [] } = data || {};
  if (!Array.isArray(xData[0])) {
    xData = [xData];
  }
  if (!Array.isArray(yData[0])) {
    yData = [yData];
  }
  xData.forEach((d: TData, i: number) => {
    set(option, ['xAxis', i, 'data'], d);
  });
  yData.forEach((d: TData, i: number) => {
    set(option, ['yAxis', i, 'data'], d);
  });
  merge(option, { series: metricData, legend: { data: legendData } });
  return option;
}
