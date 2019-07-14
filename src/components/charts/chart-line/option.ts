import { merge, set, cloneDeep, isString } from 'lodash';
import { getConfig } from '~/config';

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


export function getOption(data: IData, customOption: string | object) {
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
  if (customOption) {
    // 对用户的配置做些格式处理
    let copy = customOption;
    if (isString(customOption)) {
      copy = getConfig(['chartOption', customOption]);
      if (!copy) {
        console.warn(`customOption \`${customOption}\` not registered yet`);
      }
    }
    copy = cloneDeep(copy) as any;
    let { xAxis, yAxis } = copy;
    // 横纵轴都用数组形式
    xAxis = Array.isArray(xAxis) ? xAxis : [xAxis];
    yAxis = Array.isArray(yAxis) ? yAxis : [yAxis];
    option = merge(defaultOption, { ...copy, xAxis, yAxis });
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
