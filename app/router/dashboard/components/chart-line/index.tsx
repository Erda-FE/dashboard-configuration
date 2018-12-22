/**
 * 2D 线形图：折线、柱状、曲线
 */
import React from 'react';
import ChartSizeMe from '../chart-sizeme';
import { merge, get } from 'lodash';
import { ReactEchartsPropsTypes } from 'dashboard/types';

type IType = 'line' | 'bar' | 'area';

interface IData {
  type?: IType
  data: number[]
  smooth?: boolean
  areaStyle?: object // 基本面积图时，传入空的{}即可
}

interface IProps extends ReactEchartsPropsTypes {
  names: string[]
  datas: IData[]
  descHeight?: number // 图表应减少的高度
  isMock?: boolean
  chartType?: IType
}

const baseAxis = {
  type: 'category',
  boundaryGap: true,
};

const getAreaType = (type: string) => (type === 'area' ? 'line' : (type || 'line'));
const getOthers = (type: string) => (type === 'area' ? { areaStyle: {}, smooth: true } : {});
const mockNames = ['demo1', 'demo2', 'demo3', 'demo4', 'demo5', 'demo6', 'demo7'];
const mockDatas = [{
  data: [820, 932, 901, 934, 1290, 1330, 1320],
}];

const ChartLine = ({ option = {}, names, datas, isMock, chartType, ...others }: IProps) => {
  let xAxisType = get(option, ['xAxis', 'type']);
  const yAxisType = get(option, ['yAxis', 'type']);
  if (xAxisType === 'category' || (!xAxisType && !yAxisType)) {
    xAxisType = 'category';
  }
  const realNames = isMock ? mockNames : names;
  const realDatas: any[] = isMock ? mockDatas.map(single => ({ ...single, type: chartType })) : (datas || []);
  const source = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: xAxisType === 'category' ? {
      ...baseAxis,
      data: realNames,
    } : { type: xAxisType },
    yAxis: yAxisType === 'category' ? {
      ...baseAxis,
      data: realNames,
    } : { type: yAxisType },
    series: realDatas.map(({ type, data, ...dataOthers }: any) => ({ type: getAreaType(type), data, ...getOthers(type), ...dataOthers })),
  };
  return <ChartSizeMe option={merge(source, option)} isMock={isMock} {...others} />;
};

export default ChartLine;
