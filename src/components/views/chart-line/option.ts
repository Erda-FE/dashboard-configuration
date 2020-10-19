import { map, merge, find } from 'lodash';
import moment from 'moment';
import { areaColors } from '../../../theme/dice';
import { cutStr, getFormatter } from '../../../common/utils';

const changeColors = ['rgb(0, 209, 156)', 'rgb(251, 162, 84)', 'rgb(247, 91, 96)'];

export function getOption(data: DC.StaticData, config: DC.ChartConfig) {
  const { metricData = [], xData, time } = data;
  const { option: inputOption = {}, optionProps = {} } = config;
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
    isMoreThanOneDay,
    moreThanOneDayFormat,
    preciseTooltip,
  } = optionProps;

  const yAxis: any[] = [];
  const series: any[] = [];
  const legendData: {name: string}[] = [];
  const moreThanOneDay = isMoreThanOneDay || (timeSpan ? timeSpan.seconds > (24 * 3600) : false);

  map(metricData, (value, i) => {
    const { axisIndex, name, tag, ...rest } = value;
    if (tag || name) {
      legendData.push({ name: tag || name });
    }
    const yAxisIndex = axisIndex || 0;
    const areaColor = areaColors[i];
    series.push({
      name: value.tag || seriesName || value.name || value.key,
      yAxisIndex,
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
      symbolSize: 1,
      barMaxWidth: 50,
      areaStyle: {
        normal: {
          color: noAreaColor ? 'transparent' : areaColor,
        },
      },
      ...rest,
      type: value.type || 'line',
      data: !isBarChangeColor ? value.data : map(value.data, (item: any, j) => {
        const sect = Math.ceil(value.data.length / changeColors.length);
        return { ...item, itemStyle: { normal: { color: changeColors[Number.parseInt(j / sect, 10)] } } };
      }),
    });
    // const curMax = value.data ? calMax([value.data]) : [];
    // maxArr[yAxisIndex] = maxArr[yAxisIndex] && maxArr[yAxisIndex] > curMax ? maxArr[yAxisIndex] : curMax;
    const curUnitType = (value.unitType || customUnitType || ''); // y轴单位
    const curUnit = (value.unit || customUnit || ''); // y轴单位
    yAxis[yAxisIndex] = {
      name: yAxisNames[yAxisIndex] || name || '',
      nameTextStyle: {
        padding: [0, 0, 0, 5],
      },
      position: yAxisIndex === 0 ? 'left' : 'right',
      offset: 10,
      splitLine: {
        show: true,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      nameLocation: 'center',
      nameGap: 30,
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

  const genTTArray = (param: any[]) => param.map((unit, i) => `<span style='color: ${unit.color}'>${cutStr(unit.seriesName, 20)} : ${preciseTooltip ? unit.value : getFormatter(...getTTUnitType(i)).format(unit.value, 2)}</span><br/>`);

  const formatTime = (timeStr: string) => moment(Number(timeStr)).format(moreThanOneDay ? 'M月D日 HH:mm' : 'HH:mm');

  let defaultTTFormatter = (param: any[]) => `${param[0].name}<br/>${genTTArray(param).join('')}`;
  if (time) {
    defaultTTFormatter = (param) => {
      const endTime = time[param[0].dataIndex + 1];
      if (!endTime) {
        return `${formatTime(param[0].name)}<br />${genTTArray(param).join('')}`;
      }
      return `${formatTime(param[0].name)} 到 ${formatTime(endTime)}<br/>${genTTArray(param).join('')}`;
    };
  }

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
        data: xData || time || [], /* 类目轴数据 */
        axisTick: {
          show: false, /* 坐标刻度 */
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          interval: find(metricData, { type: 'bar' }) ? 0 : undefined,
          formatter: xData
            ? (value: string) => value
            : (value: string) => moment(Number(value)).format(moreThanOneDay ? moreThanOneDayFormat || 'M/D HH:mm' : 'HH:mm'),
        },
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: yAxis.length > 0 ? yAxis : [{ type: 'value' }],
    dataZoom: (find(metricData, { type: 'bar' }) && (xData && xData.length > 10 || time && time.length > 10)) ?
      {
        height: 15,
        start: 0,
        end: 35,
      }
      : false,
    grid: {
      top: 40,
      left: 55,
      right: haveTwoYAxis ? 40 : 5,
      bottom: 40,
      containLabel: true,
    },
    textStyle: {
      fontFamily: 'arial',
    },
    series,
  };

  const options = merge(defaultOption, inputOption);
  return options;
}

export const getDefaultOption = () => ({
  tooltip: {
    trigger: 'axis',
    transitionDuration: 0,
    confine: true,
    axisPointer: {
      type: 'none',
    },
    // formatter: tooltipFormatter || defaultTTFormatter,
  },
  legend: {
    bottom: 10,
    padding: [15, 5, 0, 5],
    orient: 'horizontal',
    align: 'left',
    // data: legendData,
    // formatter: lgFormatter,
    type: 'scroll',
    tooltip: {
      show: true,
      formatter: (t: any) => cutStr(t.name, 100),
    },
  },
  textStyle: {
    fontFamily: 'arial',
  },
});
