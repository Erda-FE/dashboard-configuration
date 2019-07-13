import { merge, set, cloneDeep } from 'lodash';

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


export function getOption(data: IData, customOption: object) {
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
  };

  let option = defaultOption;
  if (customOption) {
    // 对用户的配置做些格式处理
    const copy = cloneDeep(customOption) as any;
    let { xAxis, yAxis } = copy;
    // 横纵轴都用数组形式
    xAxis = Array.isArray(xAxis) ? xAxis : [xAxis];
    yAxis = Array.isArray(yAxis) ? yAxis : [yAxis];
    option = merge(defaultOption, { ...copy, xAxis, yAxis });
  }

  const { xData = [], yData = [], metricData = [] } = data || {};
  xData.forEach((d: TData, i: number) => {
    set(option, ['xAxis', i, 'data'], d);
  });
  yData.forEach((d: TData, i: number) => {
    set(option, ['yAxis', i, 'data'], d);
  });
  merge(option, { series: metricData });
  console.log('option:', option);
  return option;
}
