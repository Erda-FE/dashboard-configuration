/**
 * 仪表图
 */
import React from 'react';
import { connect } from 'dva';
import { merge } from 'lodash';
import { ReactEchartsPropsTypes } from 'echarts-for-react';
import ChartSizeMe from '../chart-sizeme';
import { mockDataGauge } from './utils';

interface IData {
  name: string,
  value: number,
}

interface IProps extends ReturnType<typeof mapStateToProps>, ReactEchartsPropsTypes {
  chartId: string
  isMock?: boolean
}

const ChartGauge = ({ option = {}, isMock, name, datas }: IProps) => {
  const source = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
      {
        name,
        type: 'gauge',
        data: datas,
        title: {
          show: false,
        },
      },
    ],
  };
  return <ChartSizeMe option={merge(source, option)} isMock={isMock} />;
};

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId, isMock, datas, name }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    name: isMock ? mockDataGauge.name : (name || '') as string,
    datas: isMock ? mockDataGauge.datas : (datas || []) as IData[],
  };
};

export default connect(mapStateToProps)(ChartGauge);
