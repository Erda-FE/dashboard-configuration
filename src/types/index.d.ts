export interface ISizeMe {
  size: { width: number, height: number }
}

interface IChart {
  name: string
  icon: React.ReactNode | React.FunctionComponent // props由type组成
  Component: React.ReactNode | React.FunctionComponent // props由viewId，以及接口的返回结果组成
  Configurator: React.ReactNode | React.FunctionComponent // 配置器
  mockData?: any
  dataSettings?: any[] // props由form相关属性构成
}

export interface IChartsMap {
  [type: string]: IChart
}

export interface IExpand {
  viewType: string,
  url: string
}
