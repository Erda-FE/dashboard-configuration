// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace DC {
  interface LayoutItem {
    w: number;
    h: number;
    x: number;
    y: number;
    i: string;
    moved: boolean;
    static: boolean;
    view: DC.View;
  }

  type ILayout = LayoutItem[];

  interface ViewDefItem {
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

  interface API {
    url: string;
    method: 'GET' | 'POST';
    query?: {
      [k: string]: any;
    };
    body?: {
      [k: string]: any;
    };
    header?: {
      [k: string]: any;
    };
  }

  interface View {
    name: string;
    // 展示类型，图表或其他，界面配置时内置为chart:xxx类型; 注册了其他组件后可选择
    chartType: string; // chart:timeline | chart:bar | chart:radar ...
    tooltip?: any;
    title?: string;
    description?: string;
    hideHeader?: boolean; // 是否隐藏Header
    staticData?: StaticData; // 静态数据
    api?: API;
    loadData?: (query?: object) => Promise<any>; // 动态获取数据的方法，如果界面上配置了接口，则自动生成请求调用
    dataConvertor?: string | DataConvertor; // 数据转换，为string时表示使用已注册的方法
    config: ChartConfig;// 所有页面上的配置项
    controls?: string[] | React.Component[]; // 控件列表，展示在header下面，为string时表示使用已注册的组件
  }

  type DataConvertor = (data: object) => object;
  type OptionFn = (data: object, optionExtra?: object) => object;

  interface ChartConfig {
    // 配置优先级：optionFn > option
    option?: Option;// 图表配置（完全匹配echarts配置）
    optionProps?: {// 一些用于调整option的参数
      [k: string]: any;
    };

    optionFn?: OptionFn;
    optionExtra?: object;
  }

  interface Option {
    seriesName?: string;
    isBarChangeColor?: boolean;
    tooltipFormatter?: Function;
    isLabel?: boolean;
    noAreaColor?: boolean;
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

  interface IKVTableValue {
    value?: string;
    name?: string;
    uniKey?: string;
  }
}

