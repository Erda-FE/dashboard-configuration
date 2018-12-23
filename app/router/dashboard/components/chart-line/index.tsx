/**
 * 2D 线形图：折线、柱状、曲线
 */
import React from 'react';
import { connect } from 'dva';
import ChartSizeMe from '../chart-sizeme';
import { merge, get } from 'lodash';
import { ReactEchartsPropsTypes } from 'dashboard/types';
import { getMockLine } from './utils';

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
  const mockDataLine = getMockLine(chartType);
  const realNames = isMock ? mockDataLine.names : names;
  const realDatas: any[] = isMock ? mockDataLine.datas.map(single => ({ ...single, type: chartType })) : (datas || []);
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
  return <ChartSizeMe option={merge(source, option)} isMock={isMock} />;
};

const mapStateToProps = ({ biDashBoard: { drawerInfoMap, chartDatasMap } }: any, { chartId }: any) => {
  const chartData = chartDatasMap[chartId] || {};
  const drawerInfo = drawerInfoMap[chartId] || {};
  return {
    names: chartData.names as string[],
    datas: chartData.datas as IData[],
    isMock: chartData.isMock as boolean,
    chartType: drawerInfo.chartType as string,
  };
};

export default connect(mapStateToProps)(ChartLine);
