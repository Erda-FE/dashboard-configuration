/**
 * 2D 线形图：折线、柱状、曲线
 */
import React from 'react';
import { connect } from 'dva';
import { merge, get } from 'lodash';
import ChartSizeMe from '../chart-sizeme';
import { mockDataLine } from './utils';
import { convertSettingToOption } from '../utils';

type IType = 'line' | 'bar' | 'area';

interface IData {
  type?: IType
  data: number[]
  smooth?: boolean
  areaStyle?: object // 基本面积图时，传入空的{}即可
}

interface IProps extends ReturnType<typeof mapStateToProps> {
  chartId: string
  isMock?: boolean
}

const baseAxis = {
  type: 'category',
  boundaryGap: true,
};

const getAreaType = (type: string) => (type === 'area' ? 'line' : (type || 'line'));
const getOthers = (type: string) => (type === 'area' ? { areaStyle: {}, smooth: true } : {});

const ChartLine = ({ option = {}, isMock, chartType, names, datas }: IProps) => {
  let xAxisType = get(option, ['xAxis', 'type']);
  const yAxisType = get(option, ['yAxis', 'type']);
  if (xAxisType === 'category' || (!xAxisType && !yAxisType)) {
    xAxisType = 'category';
  }
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
  return <ChartSizeMe option={merge(source, option)} isMock={isMock} />;
};

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId, isMock, names, datas }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  let settingOptions = convertSettingToOption(drawerInfo);
  let sourceData = isMock ? mockDataLine.datas as IData[] : (datas || []) as IData[];
  const enableLegend = get(settingOptions, 'legend.enableLegend');
  let legend = get(settingOptions, 'legend') || {};
  if (enableLegend) {
    legend = { ...legend, data: sourceData.map((data: any) => data.label) };
    sourceData = sourceData.map((data: any) => ({ ...data, name: data.label }));
  }
  settingOptions = { ...settingOptions, ...legend };
  return {
    chartType: drawerInfo.chartType as string,
    names: isMock ? mockDataLine.names : (names || []) as string[],
    datas: sourceData,
    option: settingOptions,
  };
};

export default connect(mapStateToProps)(ChartLine);
