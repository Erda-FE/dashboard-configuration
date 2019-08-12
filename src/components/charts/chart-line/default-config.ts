import { cutStr } from 'common/utils';
import moment from 'moment';

// const getTTUnitType = (i: number) => {
//   const curYAxis = yAxis[i] || yAxis[yAxis.length - 1];
//   return [curYAxis.unitType, curYAxis.unit];
// };

// const genTTArray = param => param.map((unit, i) => `<span style='color: ${unit.color}'>${cutStr(unit.seriesName, 20)} : ${getFormatter(...getTTUnitType(i)).format(unit.value, 2)}</span><br/>`);

export const getDefaultOption = () => {
  const lgFormatter = (name: string) => cutStr(name, 20);

  return {
    tooltip: {
      trigger: 'axis',
      transitionDuration: 0,
      confine: true,
      axisPointer: {
        type: 'none',
      },
    //   formatter: defaultTTFormatter,
    },
    legend: {
      bottom: 10,
      padding: [15, 5, 0, 5],
      orient: 'horizontal',
      align: 'left',
      //   data: legendData,
      formatter: lgFormatter,
      type: 'scroll',
      tooltip: {
        show: true,
        formatter: (t: any) => cutStr(t.name, 100),
      },
    },
    // grid: {
    //   top: haveTwoYAxis ? 30 : 25,
    //   left: 15,
    //   right: haveTwoYAxis ? 30 : 5,
    //   bottom: 40,
    //   containLabel: true,
    // },
    // xAxis: [
    //   {
    //     type: 'category',
    //     data: xAxis || time || [], /* X轴数据 */
    //     axisTick: {
    //       show: false, /* 坐标刻度 */
    //     },
    //     axisLine: {
    //       show: false,
    //     },
    //     axisLabel: {
    //       formatter: xAxis
    //         ? value => value
    //         : value => moment(Number(value)).format(moreThanOneDay ? 'M/D HH:mm' : 'HH:mm'),
    //     },
    //     splitLine: {
    //       show: false,
    //     },
    //   },
    // ],
    // yAxis,
    textStyle: {
      fontFamily: 'arial',
    },
  };
};
