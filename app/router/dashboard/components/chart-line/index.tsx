/**
 * 2D 线形图：折线、柱状、曲线
 */
import React from 'react';
import ChartSizeMe from '../chart-sizeme';
import { merge, get } from 'lodash';
import { ReactEchartsPropsTypes } from 'dashboard/types';

interface IData {
  type?: 'line' | 'bar'
  data: number[]
  smooth?: boolean
  areaStyle?: object // 基本面积图时，传入空的{}即可
}

interface IProps extends ReactEchartsPropsTypes {
  names: string[]
  datas: IData[]
  descHeight?: number // 图表应减少的高度
}

const baseAxis = {
  type: 'category',
  boundaryGap: true,
};

const ChartLine = ({ option = {}, names, datas, ...others }: IProps) => {
  let xAxisType = get(option, ['xAxis', 'type']);
  const yAxisType = get(option, ['yAxis', 'type']);
  if (xAxisType === 'category' || (!xAxisType && !yAxisType)) {
    xAxisType = 'category';
  }
  const source = {
    xAxis: xAxisType === 'category' ? {
      ...baseAxis,
      data: names,
    } : { type: xAxisType },
    yAxis: yAxisType === 'category' ? {
      ...baseAxis,
      data: names,
    } : { type: yAxisType },
    series: (datas || []).map(({ type = 'line', data, smooth = false }) => ({ type, data, smooth })),
  };
  return <ChartSizeMe option={merge(source, option)} {...others} />;
};

export default ChartLine;
