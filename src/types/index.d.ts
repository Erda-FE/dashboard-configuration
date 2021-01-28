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
  icon: DcIconType;
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

export interface ChartConfig {
  // 配置优先级：optionFn > option
  option?: Option;// echarts 配置
  /** 一些用于调整option的参数 */
  optionProps?: {
    [k: string]: any;
  };
  dataSourceConfig?: DatasourceConfig; // 数据源配置
  // 下面的字段待清理，后端没有存
  optionFn?: OptionFn;
  optionExtra?: object;
}

interface View {
  version?: string; // 指定大盘版本，识别旧版不能编辑
  name: string;
  description?: string;
  title?: string | (() => ReactNode);
  chartType: ViewType; // 展示类型，图表或其他，界面配置时内置为chart:xxx类型; 注册了其他组件后可选择
  curMapType?: any[]; // 地图层级，需要迁到其他地方
  tooltip?: any;
  chartProps?: any;
  hideHeader?: boolean; // 是否隐藏Header
  staticData?: StaticData; // 静态数据
  api?: API; // 动态数据
  chartQuery?: any;
  maskMsg?: string | Element;
  customRender?: (element: ReactElement<any>, view: any) => ReactNode; // 自定义
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
  // 维度
  typeDimensions?: DICE_DATA_CONFIGURATOR.Dimension[];
  // 值
  valueDimensions?: DICE_DATA_CONFIGURATOR.Dimension[];
  // 结果排序
  sortDimensions?: DICE_DATA_CONFIGURATOR.Dimension[];
  // 结果筛选
  resultFilters?: DICE_DATA_CONFIGURATOR.Dimension[];
  // 自定义时间区间，可选
  customTime?: string;
  // sql 模式
  isSqlMode?: boolean;
  // sql 内容
  sql?: SqlContent;
  // 返回结果限制
  limit?: number;
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
