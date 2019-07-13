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
  viewId: string
  isMock: boolean
  defaultOption: object
}

const ChartGauge = ({ option = {}, defaultOption, isMock, name, datas, viewId }: IProps) => {
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
  return <ChartSizeMe option={merge(source, defaultOption, option)} viewId={viewId} />;
};

const mapStateToProps = ({ biEditor: { viewMap } }: any, { viewId, isMock, datas, name }: any) => {
  const drawerInfo = viewMap[viewId] || {};
  return {
    viewType: drawerInfo.viewType as string,
    name: isMock ? mockDataGauge.name : (name || '') as string,
    datas: isMock ? mockDataGauge.datas : (datas || []) as IData[],
    option: convertSettingToOption(drawerInfo),
  };
};

export default connect(mapStateToProps)(ChartGauge);
