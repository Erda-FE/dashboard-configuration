type Func = (...args: any[]) => any;

interface EventMap {
  [key: string]: Func,
}

interface ObjectMap {
  [key: string]: any,
}

interface OptsMap {
  devicePixelRatio?: number,
  renderer?: 'canvas' | 'svg',
  width?: number | null | undefined | 'auto',
  height?: number | null | undefined | 'auto',
}

export interface ReactEchartsPropsTypes {
  option?: ObjectMap;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  style?: ObjectMap;
  className?: string;
  theme?: string | null;
  onChartReady?: Func;
  showLoading?: boolean;
  loadingOption?: ObjectMap;
  onEvents?: EventMap;
  echarts?: object;
  opts?: OptsMap;
  shouldSetOption?: Func;
}

export interface ISizeMe {
  size: { width: number, height: number }
}

interface IChart {
  name: string
  icon: React.ReactNode | React.SFC // props由type组成
  component: React.ReactNode | React.SFC // props由chartId，以及接口的返回结果组成
  mockData: any
}

export interface IChartsMap {
  [type: string]: IChart
}