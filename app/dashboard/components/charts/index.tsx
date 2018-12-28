import React from 'react';
import { Icon } from 'antd';
// 图表
import ChartLine from './chart-line';
import ChartPie from './chart-pie';
import ChartCards from './chart-cards';
// mock数据
import { mockDataLine } from './chart-line/utils';
import { mockDataPie } from './chart-pie/utils';
import { mockDataCards } from './chart-cards/utils';
import { IChartsMap } from '../../types';

const defaultChartsMap: IChartsMap = {
  line: {
    name: '折线图',
    icon: <Icon type="line-chart" />,
    component: ChartLine,
    mockData: mockDataLine,
  },
  bar: {
    name: '柱状',
    icon: <Icon type="bar-chart" />,
    component: ChartLine,
    mockData: mockDataLine,
  },
  area: {
    name: '面积图',
    icon: <Icon type="area-chart" />,
    component: ChartLine,
    mockData: mockDataLine,
  },
  pie: {
    name: '饼图',
    icon: <Icon type="pie-chart" />,
    component: ChartPie,
    mockData: mockDataPie,
  },
  cards: {
    name: '卡片图',
    icon: <Icon type="fund" />,
    component: ChartCards,
    mockData: mockDataCards,
  },
};

export default defaultChartsMap;
