/**
 * 2D 线形图：折线、柱状、曲线
 */
import { get, merge } from 'lodash';

import ChartSizeMe from '../chart-sizeme';
import React from 'react';
import { connect } from 'dva';
import { convertSettingToOption } from '../utils';
import { mockDataLine } from './utils';

type IType = 'line' | 'bar' | 'area';

interface IData {
  type?: IType
  data: number[]
  smooth?: boolean
  areaStyle?: object // 基本面积图时，传入空的{}即可
}

interface IProps extends ReturnType<typeof mapStateToProps> {
  chartId: string
  isMock: boolean
  defaultOption: object
}

const baseAxis = {
  type: 'category',
  boundaryGap: true,
};

const getAreaType = (type: string) => (type === 'area' ? 'line' : (type || 'line'));
const getOthers = (type: string) => (type === 'area' ? { areaStyle: {}, smooth: true } : {});

const ChartLine = ({ option = {}, defaultOption, isMock, chartType, names, datas, chartId }: IProps) => {
  const xAxisType = get(option, ['xAxis', 'type'], 'category');
  const yAxisType = get(option, ['yAxis', 'type'], 'value');
  const source = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: xAxisType === 'category' ? {
      ...baseAxis,
      data: names,
    } : { type: xAxisType },
    yAxis: yAxisType === 'category' ? {
      ...baseAxis,
      data: names,
    } : { type: yAxisType },
    series: datas.map(({ data, ...dataOthers }: any) => ({ type: getAreaType(chartType), data, ...getOthers(chartType), ...dataOthers })),
  };
  return <ChartSizeMe option={merge(source, defaultOption, option)} chartId={chartId} />;
};

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId, isMock, names, datas }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    names: isMock ? mockDataLine.names : (names || []) as string[],
    datas: isMock ? mockDataLine.datas : (datas || []) as IData[],
    option: convertSettingToOption(drawerInfo),
  };
};

export default connect(mapStateToProps)(ChartLine);
