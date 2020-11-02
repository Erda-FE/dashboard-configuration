import React from 'react';
import { get, map, set } from 'lodash';
// 图表
import ChartLine from './chart-line';
import ChartPie from './chart-pie';
import ChartMetric from './chart-metric';
import ChartTable from './chart-table';
import ChartMap from './chart-map';
// 图表配置器
import LineConfigurator from './chart-line/configurator';
import PieConfigurator from './chart-pie/configurator';
import MetricConfigurator from './chart-metric/configurator';
import TableConfigurator from './chart-table/configurator';
import MapConfigurator from './chart-map/configurator';

const SvgContainer = ({ children }: any) => (
  <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="90" height="90">
    {children}
  </svg>
);

const basicCharts: DC.ViewDefMap = {
  'chart:line': {
    name: '折线图',
    enName: 'Line',
    image: (
      <SvgContainer>
        <path d="M497.778 790.756L304.356 651.378l-133.69 108.089-54.044-68.267 182.045-147.911 204.8 145.067 358.4-213.334 45.51 73.956z" fill="#25ca64" /><path d="M497.778 534.756L304.356 395.378l-133.69 108.089-54.044-68.267 182.045-147.911 204.8 145.067 358.4-213.334 45.51 73.956z" fill="#5d48df" />
      </SvgContainer>
    ),
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
    enName: 'Area',
    image: (
      <SvgContainer>
        <path d="M85.333 824.889S201.956 199.11 352.711 199.11c125.156 0 119.467 227.556 213.333 227.556s76.8-116.623 176.356-116.623c156.444 0 196.267 512 196.267 512H85.333z" fill="#25ca64" /><path d="M85.333 824.889s116.623-310.045 267.378-310.045c125.156 0 119.467 113.778 213.333 113.778s76.8-56.889 176.356-56.889c156.444 0 196.267 256 196.267 256H85.333z" fill="#5d48df" />
      </SvgContainer>
    ),
    Component(props) {
      const metricData = get(props, 'data.metricData');
      const _metricData = map(metricData, (metric => ({ ...metric, type: 'line' })));
      set(props, 'data.metricData', _metricData);
      set(props, 'config.optionProps.noAreaColor', false);
      return <ChartLine {...props} />;
    },
    Configurator: LineConfigurator,
  },
  'chart:bar': {
    name: '柱状图',
    enName: 'Bar',
    image: (
      <SvgContainer>
        <path d="M142.222 526.222h142.222v312.89H142.222z" fill="#25ca64" /><path d="M341.333 184.889h142.223V839.11H341.333z" fill="#706EE7" /><path d="M540.444 412.444h142.223v426.667H540.444z" fill="#29C287" /><path d="M739.556 611.556h142.222V839.11H739.556z" fill="#5d48df" />
      </SvgContainer>
    ),
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
    enName: 'Pie',
    image: (
      <SvgContainer>
        <path d="M483.556 540.444V145.067C292.978 159.289 142.222 318.577 142.222 512c0 204.8 164.978 369.778 369.778 369.778 193.422 0 352.711-150.756 366.933-341.334H483.556z" fill="#5d48df" /><path d="M540.444 116.622v366.934h366.934C896 287.289 736.71 128 540.444 116.622z" fill="#25ca64" />
      </SvgContainer>
    ),
    Component: ChartPie,
    Configurator: PieConfigurator,
  },
  card: {
    name: '卡片图',
    enName: 'Card',
    image: (
      <SvgContainer>
        <path d="M142.222 796.444h142.222l-71.11-142.222z m199.111-85.333h568.89v85.333h-568.89z" fill="#25ca64" /><path d="M876.089 307.2c0-54.044-45.511-99.556-99.556-99.556s-99.555 45.512-99.555 99.556h56.889c0-22.756 19.91-42.667 42.666-42.667S819.2 284.444 819.2 307.2c0 17.067-8.533 31.289-22.756 36.978-8.533 5.689-17.066 14.222-17.066 25.6s5.689 19.91 17.066 25.6c14.223 8.533 22.756 22.755 22.756 36.978 0 22.755-19.911 42.666-42.667 42.666s-42.666-19.91-42.666-42.666h-56.89c0 54.044 45.512 99.555 99.556 99.555s99.556-45.511 99.556-99.555c0-22.756-8.533-45.512-22.756-62.578 14.223-17.067 22.756-39.822 22.756-62.578zM256 207.644c-8.533-2.844-19.911-2.844-28.444 5.69l-108.09 85.333 34.134 42.666 59.733-48.355V531.91h56.89V236.09c2.844-11.378-2.845-22.756-14.223-28.445zM591.644 307.2c0-25.6-11.377-51.2-28.444-71.111-19.911-19.911-42.667-28.445-71.111-28.445-25.6 0-51.2 11.378-71.111 28.445s-28.445 42.667-28.445 71.111h56.89c0-11.378 5.688-22.756 11.377-31.289 17.067-17.067 42.667-17.067 59.733 0 8.534 8.533 11.378 19.911 11.378 31.289s-5.689 22.756-14.222 31.289L398.222 486.4c-5.689 8.533-8.533 19.911-2.844 31.289s14.222 17.067 25.6 17.067h170.666v-56.89H480.711l82.489-99.555c17.067-19.911 28.444-45.511 28.444-71.111z" fill="#5d48df" />
      </SvgContainer>
    ),
    Component: ChartMetric,
    Configurator: MetricConfigurator,
  },
  table: {
    name: '表格图',
    enName: 'Table',
    image: (
      <SvgContainer>
        <path d="M128 412.444h768v85.334H128z m0 199.112h768v85.333H128z" fill="#25ca64" /><path d="M113.778 184.889V839.11h796.444V184.89H113.778z m28.444 625.778v-512h227.556v512H142.222z m256 0v-512h256v512h-256z m483.556 0H682.667v-512h199.11v512z" fill="#5d48df" />
      </SvgContainer>
    ),
    Component: ChartTable,
    Configurator: TableConfigurator,
  },
  'chart:scatter': {
    name: '散点图',
    enName: 'Scatter',
    image: (
      <SvgContainer>
        <path d="M192 832V128H149.333333v746.666667h746.666667v-42.666667z" fill="#5e48df" p-id="1075" data-spm-anchor-id="a313x.7781069.0.i3" className="selected" /><path d="M832 234.666667m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#25ca64" p-id="1076" data-spm-anchor-id="a313x.7781069.0.i14" className="" /><path d="M661.333333 277.333333m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#25ca64" p-id="1077" data-spm-anchor-id="a313x.7781069.0.i13" className="" /><path d="M789.333333 405.333333m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#25ca64" p-id="1078" data-spm-anchor-id="a313x.7781069.0.i15" className="" /><path d="M725.333333 554.666667m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#25ca64" p-id="1079" data-spm-anchor-id="a313x.7781069.0.i16" className="" /><path d="M597.333333 426.666667m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#25ca64" p-id="1080" data-spm-anchor-id="a313x.7781069.0.i12" className="" /><path d="M554.666667 597.333333m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#25ca64" p-id="1081" data-spm-anchor-id="a313x.7781069.0.i8" className="" /><path d="M426.666667 490.666667m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#25ca64" p-id="1082" data-spm-anchor-id="a313x.7781069.0.i11" className="" /><path d="M448 704m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#25ca64" p-id="1083" data-spm-anchor-id="a313x.7781069.0.i9" className="" /><path d="M298.666667 640m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#25ca64" p-id="1084" data-spm-anchor-id="a313x.7781069.0.i10" className="" />
      </SvgContainer>
    ),
    Component: ChartTable,
    Configurator: TableConfigurator,
  },
  'chart:map': {
    name: '地图（级联开关）',
    enName: 'Map',
    image: (
      <SvgContainer>
        <path d="M635.957895 846.147368l-91.621053-53.894736-75.452631 37.726315-80.842106-113.178947v-48.505263l-59.28421 26.947368-43.11579-53.894737H188.631579L64.673684 506.610526 48.505263 414.989474 16.168421 344.926316l32.336842-53.894737L134.736842 269.473684l16.168421-53.894737L323.368421 156.294737l32.336842 102.4 75.452632 53.894737 134.736842 43.115789 140.126316-102.4v-53.894737L808.421053 64.673684 916.210526 161.684211l91.621053-21.557895-43.11579 113.178947 21.557895 70.063158-118.568421 107.789474-43.115789-32.336842-21.557895 16.168421 26.947368 43.115789-5.389473 43.11579 53.894737 118.568421-86.231579 150.905263-156.294737 75.452631z m-91.621053-113.178947l91.621053 53.894737 129.347368-64.673684 64.673684-113.178948-53.894736-107.789473 5.389473-37.726316-37.726316-64.673684L829.978947 323.368421l37.726316 32.336842 59.284211-53.894737-16.168421-53.894737 10.778947-32.336842-16.168421 5.389474-86.231579-75.452632-48.505263 70.063158v64.673685l-183.242105 134.736842-172.463158-53.894737-102.4-70.063158-21.557895-70.063158-91.621053 37.726316-16.168421 59.28421-97.010526 21.557895-10.778947 10.778947 21.557894 53.894737L113.178947 485.052632 215.578947 592.842105h97.010527l37.726315 43.11579 97.010527-43.11579v107.789474l37.726316 64.673684 59.28421-32.336842z" fill="#5e48df" p-id="24457" /><path d="M592.842105 878.484211l59.284211 26.947368-26.947369 53.894737-64.673684-21.557895 32.336842-59.28421zM916.210526 803.031579l-91.621052 123.957895-26.947369-91.621053 80.842106-75.452632 37.726315 43.11579z" fill="#5e48df" p-id="24458" />
      </SvgContainer>
    ),
    Component: ChartMap,
    Configurator: MapConfigurator,
  },
};

export default basicCharts;
