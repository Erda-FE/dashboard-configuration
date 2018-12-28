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
