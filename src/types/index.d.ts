import React, { ReactElement, ReactNode } from 'react';

declare namespace DC {
  type TData = number[] | string[];
  type ViewType =
    | 'chart:line'
    | 'chart:area'
    | 'chart:bar'
    | 'chart:pie'
    | 'chart:funnel'
    | 'table'
    | 'card'
    | 'chart:scatter'
    | 'chart:map';

  interface ViewDefItem {
    name: string;
    enName: string;
    icon: DcIconType;
    image: React.ReactNode;
    Component: React.ReactNode | React.FunctionComponent; // props由viewId，以及接口的返回结果组成
    Configurator: React.ReactNode | React.FunctionComponent; // 配置器
    mockData?: any;
    dataSettings?: any[]; // props由form相关属性构成
  }

  interface API {
    url: string;
    method: 'get' | 'post';
    query?: Record<string, any>;
    body?: Record<string, any>;
    header?: Record<string, any>;
  }

  interface IExtraData {
    dataConfigSelectors?: any[];
    dynamicFilterKey?: string;
    dynamicFilterDataAPI?: API;
    dimensions: any[];
  }

  interface I18n {
    zh: string;
    en: string;
  }

  type DataConvertor = (data: object) => object;
  type OptionFn = (data: object, optionExtra?: object) => object;

  type ViewDefMap = Record<ViewType, ViewDefItem>;

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

  interface DatasourceConfig {
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

  interface ChartConfig {
    // 配置优先级：optionFn > option
    option?: Option; // echarts 配置
    /** 一些用于调整option的参数 */
    optionProps?: {
      [k: string]: any;
    };
    dataSourceConfig?: DatasourceConfig; // 数据源配置
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
    yAxis?: object[];
  }

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

  interface BrushTooltip {
    value: string;
    seriesName: string;
    axisValue: string;
  }

  interface View {
    /** 指定大盘版本，识别旧版不能编辑 */
    version?: string;
    name: string;
    description?: string;
    title?: string | (() => ReactNode);
    i18n?: {
      title?: I18n;
      description?: I18n;
    };
    /** 组件类型，图表或其他，界面配置时内置为chart:xxx类型; 注册了其他组件后可选择 */
    chartType: ViewType;
    /** 地图层级，需要迁到其他地方 */
    curMapType?: any[];
    tooltip?: any;
    chartProps?: any;
    /** 是否隐藏组件卡片的 Header */
    hideHeader?: boolean;
    /** 数据源类型 */
    dataSourceType: 'api' | 'static';
    /** 静态数据 */
    staticData?: StaticData;
    /** 动态数据 API */
    api?: API;
    chartQuery?: any;
    maskMsg?: string | Element;
    customRender?: (element: ReactElement<any>, view: DC.View) => ReactNode;
    /** 动态获取数据的方法，如果界面上配置了接口，则自动生成请求调用 */
    loadData?: (query?: object, body?: object) => Promise<any>;
    /** 数据转换，为 string 时表示使用已注册的方法 */
    dataConvertor?: string | DataConvertor;
    /** 组件配置项 */
    config: ChartConfig;
    /** 控件列表，展示在 header下面，为 string 时表示使用已注册的组件 */
    controls?: string[] | React.Component[] | any[];
  }

  interface LayoutItem {
    view: View;
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

  interface BoardEvent {
    /**
     *约定的事件名
     *
     * @type {string}
     * @memberof BoardEvent
     */
    eventName: string;
    /**
     *事件触发的值
     *
     * @type {*}
     * @memberof BoardEvent
     */
    cellValue: any;
    /**
     *拿到所有值集合
     *
     * @type {Record<string, any>}
     * @memberof BoardEvent
     */
    record?: Record<string, any>;
    /**
     *返回的原始数据
     *
     * @type {any}
     * @memberof BoardEvent
     */
    dataSource?: any;
  }

  type onBoardEvent = (v: BoardEvent) => void;

  type Layout = Array<Merge<LayoutItem, PureLayoutItem>>;

  interface BoardGridProps {
    /** 指定编辑器的预览时间 */
    timeSpan?: { startTimeMs: number; endTimeMs: number };
    /** 大盘名 */
    name?: string;
    /** 大盘 id，全局唯一 */
    id?: string;
    /** 配置信息，包含图表布局、各图表配置信息 */
    layout: Layout;
    /** 全局变量 */
    globalVariable?: Record<string, any>;
    /** 外部数据源表单配置器，机制待完善 */
    APIFormComponent?: React.ReactNode;
    /** 返回 false 来拦截 onSave */
    beforeOnSave?: () => boolean;
    /** 保存大盘回调 */
    onSave?: (layout: Layout[], extra: { singleLayouts: any[]; viewMap: Record<string, View> }) => void;
    /** 取消大盘编辑模式回调 */
    onCancel?: () => void;
    /** 触发大盘编辑模式回调 */
    onEdit?: () => void;
    /** 进入图表编辑模式回调 */
    onEditorToggle?: (status: boolean) => void;
    slot?: React.ReactNode;
  }

  interface PureBoardGridProps {
    /** 大盘名 */
    name?: string;
    /** 大盘 id，全局唯一 */
    id?: string;
    /** 大盘配置 */
    layout: Layout;
    /** 全局变量 */
    globalVariable?: Record<string, any>;
    /** 是否显示大盘全局操作栏 */
    showOptions?: boolean;
    /** 事件回调，需要组件支持 */
    onBoardEvent?: DC.onBoardEvent;
  }

  interface DiceDataConfigProps {
    dataConfigMetaDataStore: Object;
    dynamicFilterMetaDataStore?: Object;
    scope: string;
    scopeId: string;
    loadDataApi: Object;
  }

  interface CreateLoadDataParams {
    api: API;
    chartType: ViewType;
    typeDimensions?: DICE_DATA_CONFIGURATOR.Dimension[];
    valueDimensions?: DICE_DATA_CONFIGURATOR.Dimension[];
    isSqlMode?: boolean;
    customTime?: string;
  }

  const BoardGrid: (props: BoardGridProps) => JSX.Element;

  const PureBoardGrid: (props: PureBoardGridProps) => JSX.Element;

  interface DcRegisterComp {
    use: <C = JSX.Element, D = {} | any[]>(
      name: ViewType,
      comp: C,
      config?: {
        dataConvert?: (data: any) => D;
      },
    ) => this;
    getComp: <C = JSX.Element, D = {} | any[]>(
      name: ViewType,
      defaultComp: any,
    ) => { Comp: C; config?: { dataConvert?: (data: any) => D } };
  }

  function createLoadDataFn(params: CreateLoadDataParams): Function;

  function createOldLoadDataFn(params: any): Function;

  function setLocale(key: 'en' | 'zh'): void;

  function getLocale(): 'en' | 'zh';

  function getTheme(): string;

  function setTheme(key?: string): string;

  function regist(path: string | string[] | number | number[], data: any): void;

  function getConfig(path: string | string[] | number | number[]): void;

  function registChart(type: string, data: any): void;

  function registCharts(viewMap: Record<string, any>): void;

  function registChartOption(name: string, fn: Function): any;

  function registChartOptionFn(name: string, fn: Function): any;

  function registDataConvertor(name: string, fn: Function): any;

  function registControl(name: string, Comp: any): void;

  function registTheme(name: string, theme: object): void;

  function registDiceDataConfigProps(v: DiceDataConfigProps): void;

  const dcRegisterComp: DcRegisterComp;

  const DashboardVersion: string;

  const colorMap: {
    darkPurple: string;
    darkGreen: string;
    pink: string;
    red: string;
    yellow: string;
    orange: string;
    appleGreen: string;
    green: string;
    brown: string;
    purple: string;
    gray: string;
  };
}

export = DC;
export as namespace DC;
