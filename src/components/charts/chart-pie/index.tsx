/**
 * 2D 饼图
 */
import ChartSizeMe from '../chart-sizeme';
import React from 'react';
import { connect } from 'dva';
import { convertSettingToOption } from '../utils';
import { merge } from 'lodash';
import { mockDataPie } from './utils';

interface IData {
  name: string,
  value: number,
}

interface IProps extends ReturnType<typeof mapStateToProps> {
  chartId: string
  isMock: boolean
  defaultOption: object
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

const ChartPie = ({ option = {}, defaultOption, isMock, name, names, datas, chartId }: IProps) => {
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
  return <ChartSizeMe option={merge(source, defaultOption, option)} chartId={chartId} />;
};

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId, isMock, names, datas }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    name: isMock ? mockDataPie.name : (name || '') as string,
    names: isMock ? mockDataPie.names : (names || []) as string[],
    datas: isMock ? mockDataPie.datas : (datas || []) as IData[],
    option: convertSettingToOption(drawerInfo),
  };
};

export default connect(mapStateToProps)(ChartPie);
