/**
 * 散点图
 */
import React from 'react';
import { connect } from 'dva';
import { merge, isObject } from 'lodash';
import { ReactEchartsPropsTypes } from 'echarts-for-react';
import ChartSizeMe from '../chart-sizeme';
import { mockDataScatter } from './utils';

type IData = number[];

interface IProps extends ReturnType<typeof mapStateToProps>, ReactEchartsPropsTypes {
  chartId: string
  option?: any
  isMock?: boolean
}

const symbolIcon = (color: string) => `<span style='
    display: inline-block;
    margin-right: 5px;
    border-radius: 10px;
    width: 9px;
    height: 9px;
    background: ${color};
  '></span>`;

const gradientSwitch = (color: any) => {
  if (isObject(color)) {
    const { type, colorStops } = color;
    const params = colorStops.map(({ color: rbga, offset }: any) => `${rbga} ${offset * 100}%`);
    return `${type}-gradient(${params.join(',')})`;
  }
  return color;
};

const ChartScatter = ({ option = {}, isMock, names, titles, datas }: IProps) => {
  const source = {
    tooltip: {
      formatter: (params: any) => {
        const { name, value, color: symbolColor, data: { title } } = params;
        const tooltipText = name.map((val: string, index: number) => `${symbolIcon(gradientSwitch(symbolColor))}${val} : ${value[index]}`).join('<br />');
        return `${title}<br />${tooltipText}`;
      },
    },
    xAxis: {},
    yAxis: {},
    series: [{
      type: 'scatter',
      data: datas.map((data: number[], i: number) => ({ name: names, value: data, title: titles[i] })),
    }],
  };
  return <ChartSizeMe option={merge(source, option)} isMock={isMock} />;
};

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId, isMock, names, datas, titles }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    names: isMock ? mockDataScatter.names : (names || []) as string[],
    titles: isMock ? mockDataScatter.titles : (titles || []) as IData[],
    datas: isMock ? mockDataScatter.datas : (datas || []) as IData[],
  };
};

export default connect(mapStateToProps)(ChartScatter);
