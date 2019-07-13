import React from 'react';
import { Icon } from 'antd';
import { IChartsMap } from '../../types';
// 图表
import ChartLine from './chart-line';
import ChartPie from './chart-pie';
import ChartCards from './chart-cards';
import ChartRadar from './chart-radar';
import ChartGauge from './chart-gauge';
import ChartMap from './chart-map';
import ChartScatter from './chart-scatter';
// 图表配置器
import LineConfigurator from './chart-line/Configurator';
// import ChartPie from './chart-pie';
// import ChartCards from './chart-cards';
// import ChartRadar from './chart-radar';
// import ChartGauge from './chart-gauge';
// import ChartMap from './chart-map';
// import ChartScatter from './chart-scatter';
// mock数据
import { mockDataLine } from './chart-line/utils';
import { mockDataPie } from './chart-pie/utils';
import { mockDataCards } from './chart-cards/utils';
import { mockDataRadar } from './chart-radar/utils';
import { mockDataGauge } from './chart-gauge/utils';
import { mockDataMap } from './chart-map/utils';
import { mockDataScatter } from './chart-scatter/utils';
// 数据配置项
import DataSettingsCommon from './data-settings';
import DataSettingsCards from './chart-cards/data-settings';
import DataSettingsRadar from './chart-radar/data-settings';
// Icon
import { mapIcon } from './chart-map/utils/files';


const chartsMap: IChartsMap = {
  'chart:line': {
    name: '折线图',
    icon: <Icon type="line-chart" />,
    Component: ChartLine,
    mockData: mockDataLine,
    Configurator: LineConfigurator,
    dataSettings: [DataSettingsCommon],
  },
  'chart:bar': {
    name: '柱状图',
    icon: <Icon type="bar-chart" />,
    Component: ChartLine,
    mockData: mockDataLine,
    Configurator: LineConfigurator,
    dataSettings: [DataSettingsCommon],
  },
  // 'chart:area': {
  //   name: '面积图',
  //   icon: <Icon type="area-chart" />,
  //   Component: ChartLine,
  //   mockData: mockDataLine,
  //   Configurator: LineConfigurator,
  //   dataSettings: [DataSettingsCommon],
  // },
  // 'chart:pie': {
  //   name: '饼图',
  //   icon: <Icon type="pie-chart" />,
  //   Component: ChartPie,
  //   mockData: mockDataPie,
  //   Configurator: LineConfigurator,
  //   dataSettings: [DataSettingsCommon],
  // },
  // 'chart:card': {
  //   name: '卡片图',
  //   icon: <Icon type="fund" />,
  //   Component: ChartCards,
  //   mockData: mockDataCards,
  //   Configurator: LineConfigurator,
  //   dataSettings: [DataSettingsCommon, DataSettingsCards],
  // },
  // 'chart:radar': {
  //   name: '雷达图',
  //   icon: <Icon type="radar-chart" />,
  //   Component: ChartRadar,
  //   mockData: mockDataRadar,
  //   Configurator: LineConfigurator,
  //   dataSettings: [DataSettingsCommon, DataSettingsRadar],
  // },
  // 'chart:gauge': {
  //   name: '仪表盘',
  //   icon: <Icon type="dashboard" />,
  //   Component: ChartGauge,
  //   mockData: mockDataGauge,
  //   Configurator: LineConfigurator,
  //   dataSettings: [DataSettingsCommon],
  // },
  // 'chart:map': {
  //   name: '全国地图',
  //   /* eslint-disable react/no-danger */
  //   icon: <i className="anticon" dangerouslySetInnerHTML={mapIcon} />,
  //   Component: ChartMap,
  //   mockData: mockDataMap,
  //   Configurator: LineConfigurator,
  //   dataSettings: [DataSettingsCommon],
  // },
  // 'chart:dot': {
  //   name: '散点图',
  //   icon: <Icon type="dot-chart" />,
  //   Component: ChartScatter,
  //   Configurator: LineConfigurator,
  //   mockData: mockDataScatter,
  // },
};

export default chartsMap;
