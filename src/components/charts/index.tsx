import React from 'react';
import { Icon } from 'antd';
import { get, map, set } from 'lodash';
// 图表
import ChartLine from './chart-line';
import ChartPie from './chart-pie';
import ChartMetric from './chart-metric';
import ChartTable from './chart-table';
// 图表配置器
import LineConfigurator from './chart-line/configurator';
import PieConfigurator from './chart-pie/configurator';


const basicCharts: IChartsMap = {
  'chart:line': {
    name: '折线图',
    icon: <Icon type="line-chart" />,
    Component(props) {
      const metricData = get(props, 'data.metricData');
      const newMetricData = map(metricData, (metric => ({ ...metric, type: 'line' })));
      set(props, 'data.metricData', newMetricData);
      set(props, 'config.optionProps.noAreaColor', true);
      return <ChartLine {...props} metricData={newMetricData} />;
    },
    Configurator: LineConfigurator,
  },
  'chart:area': {
    name: '面积图',
    icon: <Icon type="area-chart" />,
    Component(props) {
      const metricData = get(props, 'data.metricData');
      const newMetricData = map(metricData, (metric => ({ ...metric, type: 'line' })));
      set(props, 'data.metricData', newMetricData);
      set(props, 'config.optionProps.noAreaColor', false);
      return <ChartLine {...props} metricData={newMetricData} />;
    },
    Configurator: LineConfigurator,
  },
  'chart:bar': {
    name: '柱状图',
    icon: <Icon type="bar-chart" />,
    Component(props) {
      const metricData = get(props, 'data.metricData');
      const newMetricData = map(metricData, (metric => ({ ...metric, type: 'bar' })));
      set(props, 'data.metricData', newMetricData);
      return <ChartLine {...props} metricData={newMetricData} />;
    },
    Configurator: LineConfigurator,
  },
  'chart:pie': {
    name: '饼图',
    icon: <Icon type="pie-chart" />,
    Component: ChartPie,
    Configurator: PieConfigurator,
  },
  card: {
    name: '卡片图',
    icon: <Icon type="fund" />,
    Component: ChartMetric,
    Configurator: LineConfigurator,
    // dataSettings: [DataSettingsCommon, DataSettingsCards],
  },
  table: {
    name: '表格图',
    icon: <Icon type="fund" />,
    Component: ChartTable,
    Configurator: LineConfigurator,
  },
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

export default basicCharts;
