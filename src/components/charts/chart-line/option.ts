import { merge, set, cloneDeep, isString } from 'lodash';
import { getConfig } from '../../../config';
import { IViewConfig, IOptionFn, IStaticData, TData } from '../../../types';


export function getOption(data: IStaticData, config: IViewConfig) {
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
    // 对用户的配置做些格式处理
    let { xAxis, yAxis } = customOption;
    // 横纵轴都用数组形式
    xAxis = Array.isArray(xAxis) ? xAxis : [xAxis];
    yAxis = Array.isArray(yAxis) ? yAxis : [yAxis];
    option = merge(defaultOption, { ...customOption, xAxis, yAxis });
  }

  // eslint-disable-next-line prefer-const
  let { xData = [], yData = [], metricData = [], legendData = [] } = data || {};
  // 先统一转为2层数组，内层数组为每条轴的data
  const x2Data = Array.isArray(xData[0]) ? xData : [xData];
  (x2Data as TData[]).forEach((d: TData, i: number) => {
    set(option, ['xAxis', i, 'data'], d);
  });
  const y2Data = Array.isArray(yData[0]) ? yData : [yData];
  // y轴只有type为category时才需要设置data
  option.yAxis.forEach((yAx: any, i) => {
    yAx.type === 'category' && (yAx.data = y2Data[i]);
  });
  if (legendData.length) {
    set(option, ['legend', 'data'], legendData);
  }
  merge(option, { series: metricData });
  return option;
}
