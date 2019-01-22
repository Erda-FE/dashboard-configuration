declare module 'react-grid-layout';
declare module 'react-sizeme';
declare var ace: any;
declare module 'echarts-for-react' {
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

  interface ReactEchartsPropsTypes {
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
    themeObj?: {}
  }
  export default class ReactEcharts extends React.Component<ReactEchartsPropsTypes, any> {}
}

declare module 'dom-to-image';

declare module 'screenfull';
