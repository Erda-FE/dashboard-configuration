/**
 * 仪表图
 */
import ChartSizeMe from '../chart-sizeme';
import React from 'react';
import { connect } from 'dva';
import { convertSettingToOption } from '../utils';
import { merge } from 'lodash';
import { mockDataGauge } from './utils';

interface IData {
  name: string,
  value: number,
}

interface IProps extends ReturnType<typeof mapStateToProps> {
  chartId: string
  isMock: boolean
  defaultOption: object
}

const ChartGauge = ({ option = {}, defaultOption, isMock, name, datas, chartId }: IProps) => {
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
  return <ChartSizeMe option={merge(source, defaultOption, option)} chartId={chartId} />;
};

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId, isMock, datas, name }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    name: isMock ? mockDataGauge.name : (name || '') as string,
    datas: isMock ? mockDataGauge.datas : (datas || []) as IData[],
    option: convertSettingToOption(drawerInfo),
  };
};

export default connect(mapStateToProps)(ChartGauge);
