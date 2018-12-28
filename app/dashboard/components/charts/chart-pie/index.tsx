/**
 * 2D 饼图
 */
import React from 'react';
import { connect } from 'dva';
import { merge, get } from 'lodash';
import ChartSizeMe from '../chart-sizeme';
import { ReactEchartsPropsTypes } from '../../../types';
import { mockDataPie } from './utils';

interface IData {
  name: string,
  value: number,
}

interface IProps extends ReturnType<typeof mapStateToProps>, ReactEchartsPropsTypes {
  chartId: string
  option?: any
  isMock?: boolean
}

// 获取默认的前面选中的6个
const getDefaultSelected = (names: string[]) => {
  const selected = {};
  const length = names.length;
  for (let i = 0; i < length; i++) {
    const name = names[i];
    selected[name] = i < 6;
  }
  return selected;
};

const ChartPie = ({ option = {}, isMock, name, names, datas }: IProps) => {
  const source = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: names,
      selected: getDefaultSelected(names),
    },
    series: [
      {
        name,
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: datas,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
  return <ChartSizeMe option={merge(source, option)} isMock={isMock} />;
};

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId, isMock, names, datas }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    name: isMock ? mockDataPie.name : (name || '') as string,
    names: isMock ? mockDataPie.names : (names || []) as string[],
    datas: isMock ? mockDataPie.datas : (datas || []) as IData[],
  };
};

export default connect(mapStateToProps)(ChartPie);
