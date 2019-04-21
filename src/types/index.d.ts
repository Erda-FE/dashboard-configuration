export interface ISizeMe {
  size: { width: number, height: number }
}

interface IChart {
  name: string
  icon: React.ReactNode | React.SFC // props由type组成
  component: React.ReactNode | React.SFC // props由chartId，以及接口的返回结果组成
  mockData?: any
  dataSettings?: any[] // props由form相关属性构成
}

export interface IChartsMap {
  [type: string]: IChart
}

export interface IExpand {
  chartType: string,
  url: string
}
