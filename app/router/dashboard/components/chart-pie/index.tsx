/**
 * 2D 饼图
 */
import React from 'react';
import { connect } from 'dva';
import ChartSizeMe from '../chart-sizeme';
import { merge } from 'lodash';
import { ReactEchartsPropsTypes } from 'dashboard/types';
import { mockDataPie } from './utils';

interface IData {
  name: string,
  value: number,
}

interface IProps extends ReturnType<typeof mapStateToProps>, ReactEchartsPropsTypes {
  chartId: string
  option?: any
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

const ChartPie = ({ option = {}, isMock, chartType, name = '', names, datas, ...others }: IProps) => {
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
      data: isMock ? mockDataPie.names : names,
      selected: isMock ? getDefaultSelected(mockDataPie.names) : getDefaultSelected(names),
    },
    series: [
      {
        name: isMock ? mockDataPie.name : name,
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: isMock ? mockDataPie.datas : datas,
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
  return <ChartSizeMe option={merge(source, option)} isMock={isMock} {...others} />;
};

const mapStateToProps = ({ biDashBoard: { drawerInfoMap, chartDatasMap } }: any, { chartId }: any) => ({
  name: chartDatasMap[chartId].name as string,
  names: chartDatasMap[chartId].names as string[],
  datas: chartDatasMap[chartId].datas as IData[],
  isMock: chartDatasMap[chartId].isMock as boolean,
  chartType: drawerInfoMap[chartId].chartType as string,
});

export default connect(mapStateToProps)(ChartPie);
