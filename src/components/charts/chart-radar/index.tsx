/**
 * 雷达图
 */
import React from 'react';
import { connect } from 'dva';
import { merge } from 'lodash';
import { ReactEchartsPropsTypes } from 'echarts-for-react';
import ChartSizeMe from '../chart-sizeme';
import { mockDataRadar, mockIndicator } from './utils';
import { pannelDataPrefix } from '../../utils';

interface IData {
  name: string,
  value: number,
}

interface IProps extends ReturnType<typeof mapStateToProps>, ReactEchartsPropsTypes {
  chartId: string
  isMock?: boolean
}

const ChartRadar = ({ option = {}, isMock, datas, names, indicator }: IProps) => {
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
        type: 'radar',
        data: datas,
      },
    ],
  };
  return <ChartSizeMe option={merge(source, option)} isMock={isMock} />;
};

const getIndicator = (drawerInfo: any) => {
  let indicator: {name: string, max: number}[] = [];
  const radarKeys = Object.keys(drawerInfo).filter(key => key.includes('radarConfigKey'));
  indicator = radarKeys.map((key) => {
    const name = drawerInfo[key];
    const maxKey = `${pannelDataPrefix}radarConfigMax${key.slice(-1)}`;
    const max = drawerInfo[maxKey];
    return { name, max };
  });
  return indicator;
};

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId, isMock, datas, names }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  const indicator = isMock ? mockIndicator : getIndicator(drawerInfo);
  return {
    chartType: drawerInfo.chartType as string,
    names: isMock ? mockDataRadar.names : (names || []) as string[],
    indicator,
    datas: isMock ? mockDataRadar.datas : (datas || []) as IData[],
  };
};

export default connect(mapStateToProps)(ChartRadar);
