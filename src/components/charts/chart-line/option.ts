import { map } from 'lodash';
import moment from 'moment';
import { areaColors } from '../../../theme/dice';
import { cutStr, getFormatter } from 'common/utils';

const changeColors = ['rgb(0, 209, 156)', 'rgb(251, 162, 84)', 'rgb(247, 91, 96)'];

export function getOption(data: IStaticData, config: IChartConfig) {
  const { metricData = [], xData = [] } = data || {};
  const { option: inputOption = {} } = config;
  const {
    seriesName,
    isBarChangeColor,
    tooltipFormatter,
    isLabel,
    unitType: customUnitType,
    unit: customUnit,
    noAreaColor,
    decimal = 2,
    yAxisNames = [],
    legendFormatter,
    timeSpan,
  } = inputOption;

  const yAxis: any[] = [];
  const series: any[] = [];
  const legendData: {name: string}[] = [];
  const moreThanOneDay = timeSpan ? timeSpan.seconds > (24 * 3600) : false;

  map(metricData, (value, i) => {
    const { axisIndex, name, tag } = value;
    if (tag || name) {
      legendData.push({ name: tag || name });
    }
    const yAxisIndex = 0; // axisIndex || 0;
    const areaColor = areaColors[i];
    series.push({
      type: value.chartType || 'line',
      name: value.tag || seriesName || value.name || value.key,
      yAxisIndex,
      data: !isBarChangeColor ? value.data : map(value.data, (item: any, j) => {
        const sect = Math.ceil(value.data.length / changeColors.length);
        return { ...item, itemStyle: { normal: { color: changeColors[Number.parseInt(j / sect, 10)] } } };
      }),
      label: {
        normal: {
          show: isLabel,
          position: 'top',
          formatter: (label: any) => label.data.label,
        },
      },
      // markLine: i === 0 ? markLine : {}, //TODO
      connectNulls: true,
      symbol: 'emptyCircle',
      barMaxWidth: 50,
      areaStyle: {
        normal: {
          color: noAreaColor ? 'transparent' : areaColor,
        },
      },
    });
    // const curMax = value.data ? calMax([value.data]) : [];
    // maxArr[yAxisIndex] = maxArr[yAxisIndex] && maxArr[yAxisIndex] > curMax ? maxArr[yAxisIndex] : curMax;
    const curUnitType = (value.unitType || customUnitType || ''); // y轴单位
    const curUnit = (value.unit || customUnit || ''); // y轴单位
    yAxis[yAxisIndex] = {
      name: name || yAxisNames[yAxisIndex] || '',
      nameTextStyle: {
        padding: [0, 0, 0, 5],
      },
      position: yAxisIndex === 0 ? 'left' : 'right',
      offset: 10,
      min: 0,
      splitLine: {
        show: true,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      unitType: curUnitType,
      unit: curUnit,
      axisLabel: {
        margin: 0,
        formatter: (val: string) => getFormatter(curUnitType, curUnit).format(val, decimal),
      },
    };
  });

  const lgFormatter = (name: string) => {
    const defaultName = legendFormatter ? legendFormatter(name) : name;
    return cutStr(defaultName, 20);
  };

  const getTTUnitType = (i: number) => {
    const curYAxis = yAxis[i] || yAxis[yAxis.length - 1];
    return [curYAxis.unitType, curYAxis.unit];
  };

  const genTTArray = (param: any[]) => param.map((unit, i) => `<span style='color: ${unit.color}'>${cutStr(unit.seriesName, 20)} : ${getFormatter(...getTTUnitType(i)).format(unit.value, 2)}</span><br/>`);

  const defaultTTFormatter = (param: any[]) => `${param[0].name}<br/>${genTTArray(param).join('')}`;
  const haveTwoYAxis = yAxis.length > 1;

  const defaultOption = {
    tooltip: {
      trigger: 'axis',
      transitionDuration: 0,
      confine: true,
      axisPointer: {
        type: 'none',
      },
      formatter: tooltipFormatter || defaultTTFormatter,
    },
    legend: {
      bottom: 10,
      padding: [15, 5, 0, 5],
      orient: 'horizontal',
      align: 'left',
      data: legendData,
      formatter: lgFormatter,
      type: 'scroll',
      tooltip: {
        show: true,
        formatter: (t: any) => cutStr(t.name, 100),
      },
    },
    xAxis: [
      {
        type: 'category',
        data: xData, /* X轴数据 */
        axisTick: {
          show: false, /* 坐标刻度 */
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          formatter: xData
            ? (value: string) => value
            : (value: string) => moment(Number(value)).format(moreThanOneDay ? 'M/D HH:mm' : 'HH:mm'),
        },
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: yAxis.length > 0 ? yAxis : [{ type: 'value' }],
    grid: {
      top: haveTwoYAxis ? 30 : 25,
      left: 15,
      right: haveTwoYAxis ? 30 : 5,
      bottom: 40,
      containLabel: true,
    },
    textStyle: {
      fontFamily: 'arial',
    },
    series,
  };
  return defaultOption;
}
