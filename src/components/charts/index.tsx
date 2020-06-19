import React from 'react';
import { Icon } from 'antd';
import { get, map, set, cloneDeep } from 'lodash';
// 图表
import ChartLine from './chart-line';
import ChartPie from './chart-pie';
import ChartMetric from './chart-metric';
import ChartTable from './chart-table';
// 图表配置器
import LineConfigurator from './chart-line/configurator';
import PieConfigurator from './chart-pie/configurator';
import MetricConfigurator from './chart-metric/configurator';
import TableConfigurator from './chart-table/configurator';

const basicCharts: IChartsMap = {
  'chart:line': {
    name: '折线图',
    icon: <Icon type="line-chart" />,
    Component(props) {
      const metricData = get(props, 'data.metricData');
      const _metricData = map(metricData, (metric => ({ ...metric, type: 'line' })));
      set(props, 'data.metricData', _metricData);
      set(props, 'config.optionProps.noAreaColor', true);
      return <ChartLine {...props} />;
    },
    Configurator: LineConfigurator,
  },
  'chart:area': {
    name: '面积图',
    icon: <Icon type="area-chart" />,
    Component(props) {
      const metricData = get(props, 'data.metricData');
      const _metricData = map(metricData, (metric => ({ ...metric, type: 'area' })));
      set(props, 'data.metricData', _metricData);
      set(props, 'config.optionProps.noAreaColor', false);
      return <ChartLine {...props} />;
    },
    Configurator: LineConfigurator,
  },
  'chart:bar': {
    name: '柱状图',
    icon: <Icon type="bar-chart" />,
    Component(props) {
      const data = get(props, 'data');
      const metricData = get(props, 'data.metricData');
      const _metricData = map(metricData, (metric => ({ ...metric, type: 'bar' })));
      const _props = { ...props, data: { ...data, metricData: _metricData } };
      return <ChartLine {..._props} />;
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
    Configurator: MetricConfigurator,
  },
  table: {
    name: '表格图',
    icon: <Icon type="fund" />,
    Component: ChartTable,
    Configurator: TableConfigurator,
  },
};

export default basicCharts;
