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
// mock数据
import { mockDataLine } from './chart-line/utils';
import { mockDataPie } from './chart-pie/utils';
import { mockDataCards } from './chart-cards/utils';
import { mockDataRadar } from './chart-radar/utils';
import { mockDataGauge } from './chart-gauge/utils';
// 数据配置项
import DataSettingsCommon from './data-settings';
import DataSettingsCards from './chart-cards/data-settings';
import DataSettingsRadar from './chart-radar/data-settings';

import mapIcon from 'images/ChinaMap.svg';

const defaultChartsMap: IChartsMap = {
  line: {
    name: '折线图',
    icon: <Icon type="line-chart" />,
    component: ChartLine,
    mockData: mockDataLine,
    dataSettings: [DataSettingsCommon],
  },
  bar: {
    name: '柱状',
    icon: <Icon type="bar-chart" />,
    component: ChartLine,
    mockData: mockDataLine,
    dataSettings: [DataSettingsCommon],
  },
  area: {
    name: '面积图',
    icon: <Icon type="area-chart" />,
    component: ChartLine,
    mockData: mockDataLine,
    dataSettings: [DataSettingsCommon],
  },
  pie: {
    name: '饼图',
    icon: <Icon type="pie-chart" />,
    component: ChartPie,
    mockData: mockDataPie,
    dataSettings: [DataSettingsCommon],
  },
  cards: {
    name: '卡片图',
    icon: <Icon type="fund" />,
    component: ChartCards,
    mockData: mockDataCards,
    dataSettings: [DataSettingsCommon, DataSettingsCards],
  },
  radar: {
    name: '雷达图',
    icon: <Icon type="radar-chart" />,
    component: ChartRadar,
    mockData: mockDataRadar,
    dataSettings: [DataSettingsCommon, DataSettingsRadar],
  },
  gauge: {
    name: '仪表盘',
    icon: <Icon type="dashboard" />,
    component: ChartGauge,
    mockData: mockDataGauge,
    dataSettings: [DataSettingsCommon],
  },
  map: {
    name: '全国地图',
    icon: <img style={{ width: '30px', height: '30px', paddingTop: '5px', position: 'relative', top: '-6px' }} src={mapIcon} />,
    component: ChartMap,
    mockData: mockDataGauge,
    dataSettings: [DataSettingsCommon],
  },
};

export default defaultChartsMap;
