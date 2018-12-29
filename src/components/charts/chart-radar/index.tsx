/**
 * 雷达图
 */
import React from 'react';
import { connect } from 'dva';
import { merge } from 'lodash';
import { ReactEchartsPropsTypes } from 'echarts-for-react';
import ChartSizeMe from '../chart-sizeme';
import { mockDataRadar } from './utils';

interface IData {
  name: string,
  value: number,
}

interface IProps extends ReturnType<typeof mapStateToProps>, ReactEchartsPropsTypes {
  chartId: string
  isMock?: boolean
}

const ChartRadar = ({ option = {}, isMock, name, datas, names, indicator }: IProps) => {
  const source = {
    legend: {
      data: names,
    },
    radar: {
      name: {
        textStyle: {
          color: '#fff',
          backgroundColor: '#999',
          borderRadius: 3,
          padding: [3, 5],
        },
      },
      indicator,
    },
    series: [
      {
        name,
        type: 'radar',
        data: datas,
      },
    ],
  };
  return <ChartSizeMe option={merge(source, option)} isMock={isMock} />;
};

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId, isMock, datas, names, indicator }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    name: isMock ? mockDataRadar.name : (name || '') as string,
    names: isMock ? mockDataRadar.names : (names || []) as string[],
    indicator: isMock ? mockDataRadar.indicator : (indicator || []) as string[],
    datas: isMock ? mockDataRadar.datas : (datas || []) as IData[],
  };
};

export default connect(mapStateToProps)(ChartRadar);
