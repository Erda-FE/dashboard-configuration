/**
 * 2D 线形图：折线、柱状、曲线
 */
import React from 'react';
import { connect } from 'dva';
import ChartSizeMe from '../chart-sizeme';
import { merge, get } from 'lodash';
import { ReactEchartsPropsTypes } from '../../types';
import { mockDataLine } from './utils';

type IType = 'line' | 'bar' | 'area';

interface IData {
  type?: IType
  data: number[]
  smooth?: boolean
  areaStyle?: object // 基本面积图时，传入空的{}即可
}

interface IProps extends ReturnType<typeof mapStateToProps>, ReactEchartsPropsTypes {
  chartId: string
  option?: any
  names?: string[],
  datas?: IData[],
  isMock?: boolean
}

const baseAxis = {
  type: 'category',
  boundaryGap: true,
};

const getAreaType = (type: string) => (type === 'area' ? 'line' : (type || 'line'));
const getOthers = (type: string) => (type === 'area' ? { areaStyle: {}, smooth: true } : {});

const ChartLine = ({ option = {}, names, datas, isMock, chartType }: IProps) => {
  let xAxisType = get(option, ['xAxis', 'type']);
  const yAxisType = get(option, ['yAxis', 'type']);
  if (xAxisType === 'category' || (!xAxisType && !yAxisType)) {
    xAxisType = 'category';
  }
  const realNames = isMock ? mockDataLine.names : names;
  const realDatas: any[] = isMock ? mockDataLine.datas : (datas || []);
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
    series: realDatas.map(({ data, ...dataOthers }: any) => ({ type: getAreaType(chartType), data, ...getOthers(chartType), ...dataOthers })),
  };
  return <ChartSizeMe option={merge(source, option)} isMock={isMock} />;
};

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  return {
    chartType: drawerInfo.chartType as string,
  };
};

export default connect(mapStateToProps)(ChartLine);
