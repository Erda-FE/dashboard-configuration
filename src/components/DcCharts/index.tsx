import React from 'react';
import { cloneDeep, get, map, set } from 'lodash';
// 图表组件
import ChartLine from './chart-line';
import ChartPie from './chart-pie';
import ChartMetric from './chart-metric';
import ChartTable from './chart-table';
import ChartMap from './chart-map';
import ChartFunnel from './chart-funnel';
// 图表配置器
import LineConfigurator from './chart-line/configurator';
import PieConfigurator from './chart-pie/configurator';
import MetricConfigurator from './chart-metric/configurator';
import TableConfigurator from './chart-table/configurator';
import MapConfigurator from './chart-map/configurator';
import FunnelConfigurator from './chart-funnel/configurator';

const basicCharts: Partial<DC.ViewDefMap> = {
  'chart:line': {
    name: '折线图',
    enName: 'Line',
    icon: 'zhexian',
    // Component: ChartLine,
    Component(props: any) {
      const metricData = get(props, 'data.metricData');
      const _metricData = map(metricData, (metric) => ({ ...metric, type: 'line' }));
      set(props, 'data.metricData', _metricData);
      const config = cloneDeep(props.config) || {}; // config property is frozen when rendering
      set(config, 'optionProps.noAreaColor', true);
      return <ChartLine {...props} config={config} />;
    },
    Configurator: LineConfigurator,
  },
  'chart:area': {
    name: '面积图',
    enName: 'Area',
    icon: 'mianjitu',
    Component(props: any) {
      const metricData = get(props, 'data.metricData');
      const _metricData = map(metricData, (metric) => ({ ...metric, type: 'line' }));
      set(props, 'data.metricData', _metricData);
      const config = cloneDeep(props.config) || {}; // config property is frozen when rendering
      set(config, 'optionProps.noAreaColor', false);
      return <ChartLine {...props} config={config} />;
    },
    Configurator: LineConfigurator,
  },
  'chart:bar': {
    name: '柱状图',
    enName: 'Bar',
    icon: 'zhuzhuangtu',
    Component(props) {
      const data = get(props, 'data');
      const metricData = get(props, 'data.metricData');
      const _metricData = map(metricData, (metric) => ({ ...metric, type: 'bar' }));
      const _props = { ...props, data: { ...data, metricData: _metricData } };
      return <ChartLine {..._props} />;
    },
    Configurator: LineConfigurator,
  },
  'chart:pie': {
    name: '饼图',
    enName: 'Pie',
    icon: 'shanxingtu',
    Component: ChartPie,
    Configurator: PieConfigurator,
  },
  'chart:funnel': {
    name: '漏斗图',
    enName: 'Funnel',
    icon: 'loudoutu',
    Component: ChartFunnel,
    Configurator: FunnelConfigurator,
  },
  'chart:map': {
    name: '下钻地图',
    enName: 'Map',
    icon: 'lixianditu',
    Component: ChartMap,
    Configurator: MapConfigurator,
  },
  card: {
    name: '指标卡片',
    enName: 'Card',
    icon: 'kpi',
    Component: ChartMetric,
    Configurator: MetricConfigurator,
  },
  table: {
    name: '数据表格',
    enName: 'Table',
    icon: 'shujuji',
    Component: ChartTable,
    Configurator: TableConfigurator,
  },
};

export default basicCharts;
