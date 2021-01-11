import { ReactElement, ReactNode } from 'react';

export as namespace DC;
interface LayoutItem {
  view: DC.View;
}
interface PureLayoutItem {
  w: number;
  h: number;
  x: number;
  y: number;
  i: string;
  moved?: boolean;
  static?: boolean;
}

export type ILayout = Array<Merge<LayoutItem, PureLayoutItem>>;

export interface ViewDefItem {
  name: string;
  enName: string;
  image: React.ReactNode;
  Component: React.ReactNode | React.FunctionComponent; // props由viewId，以及接口的返回结果组成
  Configurator: React.ReactNode | React.FunctionComponent; // 配置器
  mockData?: any;
  dataSettings?: any[]; // props由form相关属性构成
}

type ViewType = 'chart:line' | 'chart:area' | 'chart:bar' | 'chart:pie' | 'chart:funnel' | 'table' | 'card' | 'chart:scatter' | 'chart:map';

type ViewDefMap = Record<ViewType, ViewDefItem>;

interface IExtraData {
  dataConfigSelectors?: any[];
  dynamicFilterKey?: string;
  dynamicFilterDataAPI?: API;
  dimensions: any[];
}

interface API {
  url: string;
  method: 'get' | 'post';
  query?: Record<string, any>;
  body?: Record<string, any>;
  header?: Record<string, any>;
}

interface View {
  /** 指定大盘版本，识别旧版不能编辑 */
  version?: string;
  name: string;
  // 展示类型，图表或其他，界面配置时内置为chart:xxx类型; 注册了其他组件后可选择
  chartType: ViewType; // chart:timeline | chart:bar | chart:radar ...
  curMapType?: any[];
  tooltip?: any;
  chartProps?: any;
  customRender?: (element: ReactElement<any>, view: any) => ReactNode;
  title?: string | (() => ReactNode);
  description?: string;
  hideHeader?: boolean; // 是否隐藏Header
  staticData?: StaticData; // 静态数据
  api?: API;
  chartQuery?: any;
  maskMsg?: string | Element;
  loadData?: (query?: object, body?: object) => Promise<any>; // 动态获取数据的方法，如果界面上配置了接口，则自动生成请求调用
  dataConvertor?: string | DataConvertor; // 数据转换，为string时表示使用已注册的方法
  config: ChartConfig;// 所有页面上的配置项
  controls?: string[] | React.Component[] | any[]; // 控件列表，展示在header下面，为string时表示使用已注册的组件
}

type DataConvertor = (data: object) => object;
type OptionFn = (data: object, optionExtra?: object) => object;

interface SqlContent {
  select?: string;
  from?: string;
  // 前端回填
  fromSource?: string[];
  where?: string;
  groupBy?: string;
  orderBy?: string;
  limit?: number;
}

export interface DatasourceConfig {
  activedMetricGroups: string[];
  typeDimensions?: DICE_DATA_CONFIGURATOR.Dimension[];
  valueDimensions?: DICE_DATA_CONFIGURATOR.Dimension[];
  sortDimensions?: DICE_DATA_CONFIGURATOR.Dimension[];
  resultFilters?: DICE_DATA_CONFIGURATOR.Dimension[];
  // 自定义时间区间，可选
  customTime?: string;
  isSqlMode?: boolean;
  sql?: SqlContent;
  limit?: number;
}

export interface ChartConfig {
  // 配置优先级：optionFn > option
  option?: Option;// 图表配置（完全匹配echarts配置）
  /** 一些用于调整option的参数 */
  optionProps?: {
    [k: string]: any;
  };
  /** 数据源配置 */
  dataSourceConfig?: DatasourceConfig;
  // 下面的字段待清理，后端没有存
  optionFn?: OptionFn;
  optionExtra?: object;
}

interface Option {
  seriesName?: string;
  isBarChangeColor?: boolean;
  tooltipFormatter?: Function;
  isLabel?: boolean;
  isConnectNulls?: boolean;
  noAreaColor?: boolean;
  nullDisplay?: string;
  unitType?: string;
  unit?: string;
  decimal?: number;
  yAxisNames?: string[];
  legendFormatter?: Function;
  timeSpan?: any;
}

type TData = number[] | string[];

interface MetricData {
  name: string;
  type: string;
  data: TData;
  [prop: string]: any; // 其他数据，有loadData时可能用于dataConvertor
}

interface StaticData {
  title: string;
  xData: TData | TData[];
  yData?: TData | TData[];
  metricData: MetricData[];
  legendData: TData[];
  extraOption: object; // 可能需要根据返回数据调整 option
  [prop: string]: any; // 其他数据，有loadData时可能用于dataConvertor
}
