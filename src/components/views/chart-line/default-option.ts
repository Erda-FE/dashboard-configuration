import { cutStr } from '../../../common/utils';

export default {
  tooltip: {
    trigger: 'axis',
    transitionDuration: 0,
    confine: true,
    axisPointer: {
      type: 'none',
    },
  },
  legend: {
    bottom: 10,
    padding: [15, 5, 0, 5],
    orient: 'horizontal',
    align: 'left',
    type: 'scroll',
    tooltip: {
      show: true,
      formatter: (t: any) => cutStr(t.name, 100),
    },
  },
  xAxis: [
    {
      axisTick: {
        show: false, /* 坐标刻度 */
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
  ],
  grid: {
    top: 40,
    left: 55,
    bottom: 40,
    containLabel: true,
  },
  textStyle: {
    fontFamily: 'arial',
  },
};
