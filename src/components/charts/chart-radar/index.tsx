/**
 * 雷达图
 */
import { mockDataRadar, mockIndicator } from './utils';

import ChartSizeMe from '../chart-sizeme';
import React from 'react';
import { connect } from 'dva';
import { convertSettingToOption } from '../utils';
import { merge } from 'lodash';
import { panelDataPrefix } from '../../../utils/constants';

interface IData {
  name: string,
  value: number,
}

interface IProps extends ReturnType<typeof mapStateToProps> {
  viewId: string
  isMock: boolean
  defaultOption: object
}

const ChartRadar = ({ option = {}, defaultOption, isMock, datas, names, indicator, viewId }: IProps) => {
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
  return <ChartSizeMe option={merge(source, defaultOption, option)} viewId={viewId} />;
};

const getIndicator = (drawerInfo: any) => {
  let indicator: {name: string, max: number}[] = [];
  const radarKeys = Object.keys(drawerInfo).filter(key => key.includes('radarConfigKey'));
  indicator = radarKeys.map((key) => {
    const name = drawerInfo[key];
    const maxKey = `${panelDataPrefix}radarConfigMax${key.slice(-1)}`;
    const max = drawerInfo[maxKey];
    return { name, max };
  });
  return indicator;
};

const mapStateToProps = ({ biEditor: { viewMap } }: any, { viewId, isMock, datas, names }: any) => {
  const drawerInfo = viewMap[viewId] || {};
  const indicator = isMock ? mockIndicator : getIndicator(drawerInfo);
  return {
    viewType: drawerInfo.viewType as string,
    names: isMock ? mockDataRadar.names : (names || []) as string[],
    indicator,
    datas: isMock ? mockDataRadar.datas : (datas || []) as IData[],
    option: convertSettingToOption(drawerInfo),
  };
};

export default connect(mapStateToProps)(ChartRadar);
