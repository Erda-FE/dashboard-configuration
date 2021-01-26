import { cutStr } from '../../../common/utils';

export default () => ({
  tooltip: {
    trigger: 'axis',
    transitionDuration: 0,
    confine: true,
  },
  legend: {
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
    left: 45,
    bottom: 40,
    containLabel: true,
  },
  textStyle: {
    fontFamily: 'arial',
  },
});
