import { map, merge, isEmpty } from 'lodash';
import moment from 'moment';
import DC from 'src/types';
import { areaColors } from '../../../theme/dice';
import { cutStr, getFormatter } from '../../../common/utils';
import { getCustomOption } from '../common/custom-option';
import getDefaultOption from './default-option';


const changeColors = ['rgb(0, 209, 156)', 'rgb(251, 162, 84)', 'rgb(247, 91, 96)'];

export function getOption(data: DC.StaticData, config: DC.ChartConfig = {}) {
  const { metricData = [], xData, time, valueNames = [] } = data;
  const { optionProps = {}, dataSourceConfig = {}, option = {} } = config;
  const { typeDimensions, valueDimensions } = dataSourceConfig;

  // 多个维度，多个数值
  const isMultipleTypeAndMultipleValue = (typeDimensions?.length || 0) > 1 && (valueDimensions?.length || 0) > 1;

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
    isMoreThanOneDay,
    moreThanOneDayFormat,
    preciseTooltip,
    isConnectNulls,
    invalidToZero,
    nullDisplay,
    showAllTooltip = false,
    useBrush = false,
  } = optionProps;

  const yAxis: any[] = [];
  const series: any[] = [];
  const legendData: Array<{ name: string }> = [];

  let defaultMoreThanOneDay = false;
  // 自动处理时间格式，大于一天显示日期
  if (!isEmpty(time)) {
    defaultMoreThanOneDay = time[time.length - 1] - time[0] > 24 * 3600 * 1000;
  }
  const moreThanOneDay = isMoreThanOneDay || defaultMoreThanOneDay;
  const convertInvalidValueToZero = (dataList: any[]) => {
    return invalidToZero
      ? map(dataList, (item) => (typeof item === 'number' && item > 0 ? item : 0))
      : dataList;
  };
  map(metricData, (value, i) => {
    const yIndex = option?.yAxis?.[i] ? i : 0;
    const { axisIndex, name, tag, alias = '', unit: _unit, ...rest } = value;
    if (tag || name) {
      legendData.push({ name: tag || name });
    }
    const yAxisIndex = yIndex || 0;
    const areaColor = areaColors[i];

    const normalSeriesData = isMultipleTypeAndMultipleValue
      ? convertInvalidValueToZero(value.data).map((x) => ({ value: x, category: name, alias }))
      : convertInvalidValueToZero(value.data);

    const seriesData = !isBarChangeColor // TODO: isBarChangeColor seem to be useless anymore
      ? normalSeriesData
      : map(value.data, (item: any, j) => {
        const sect = Math.ceil(value.data.length / changeColors.length);
        return { ...item, itemStyle: { normal: { color: changeColors[Number.parseInt(j / sect, 10)] } } };
      });

    series.push({
      name: value.tag || seriesName || value.name || value.key,
      yAxisIndex,
      label: {
        normal: {
          show: isLabel,
          position: 'top',
        },
      },
      // markLine: i === 0 ? markLine : {}, //TODO
      connectNulls: isConnectNulls || false,
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
      data: seriesData,
    });
    // y 轴单位类型
    const curUnitType = (_unit?.type || customUnitType || '');
    // y 轴基准单位
    const curUnit = (_unit?.unit || customUnit || '');
    yAxis[yAxisIndex] = {
      show: yAxisIndex === 0,
      // 轴线名
      name: yAxisNames[yAxisIndex] || valueNames[yAxisIndex] || name || '',
      // 轴线名位置
      nameLocation: 'center',
      // 轴线名离轴线间距
      nameGap: 35,
      // 轴线偏移
      offset: 30 * Math.floor(yAxisIndex / 2),
      position: yAxisIndex % 2 === 0 ? 'left' : 'right',
      // 不显示刻度
      axisTick: {
        show: false,
      },
      // 隐藏轴线
      axisLine: {
        show: false,
      },
      unitType: curUnitType,
      unit: curUnit,
      // 坐标轴刻度配置
      axisLabel: {
        margin: 0,
        formatter: (val: string) => getFormatter(curUnitType, curUnit).format(val, decimal),
      },
    };
  });

  const lgFormatter = (name: string) => {
    const defaultName = legendFormatter ? legendFormatter(name) : name;
    return cutStr(defaultName, 40);
  };
  const haveTwoYAxis = yAxis.length > 1;
  const getTTUnitType = (i: number) => {
    const curYAxis = yAxis[i] || yAxis[yAxis.length - 1];
    return [curYAxis.unitType, curYAxis.unit];
  };
  const genTTArray = (param: any[]) => param.map((unit, i) => `<span style='color: ${unit.color}'>${showAllTooltip ? unit.seriesName : cutStr(unit.seriesName, 40)} : ${(preciseTooltip || isNaN(unit.value)) ? (isNaN(unit.value) ? (nullDisplay || '--') : unit.value) : getFormatter(...getTTUnitType(i)).format(unit.value, 2)}</span><br/>`);
  const formatTime = (timeStr: string) => moment(Number(timeStr)).format(moreThanOneDay ? 'M月D日 HH:mm' : 'HH:mm');

  const formatTooltipTitle = (title: any) => (time ? formatTime(title) : title);
  let defaultTTFormatter = (param: any[]) => `${formatTooltipTitle(param[0].name)}<br />${genTTArray(param).join('')}`;

  // 多个维度，多个数值
  if (isMultipleTypeAndMultipleValue) {
    defaultTTFormatter = (param: any) => {
      return `${formatTooltipTitle(param[0].name)}<br />${genTTArray(param.map((x: any) => ({ ...x, seriesName: `${x.data.category}(${x.data.alias})` }))).join('')}`;
    };
  }

  const brushFormatter = (param: object[]) => {
    const { value = '', dataIndex = 0, seriesName: _seriesName = '', axisValue = '' } = param?.[0];
    const timeGap = time?.[1] - time?.[0];
    return `开始时间：${moment(Number(axisValue)).format('YYYY-MM-DD HH:mm:ss')}<br />结束时间：${moment(Number(axisValue) + Number(timeGap)).format('YYYY-MM-DD HH:mm:ss')}<br />${_seriesName}: ${value}  `;
  };

  const computedOption = {
    tooltip: {
      formatter: (useBrush && brushFormatter) || tooltipFormatter || defaultTTFormatter,
    },
    legend: {
      data: legendData,
      formatter: lgFormatter,
    },
    xAxis: [
      {
        data: xData || time || [],
        axisLabel: {
          formatter: xData
            ? (value: string) => value
            : (value: string) => moment(Number(value)).format(moreThanOneDay ? moreThanOneDayFormat || 'M/D HH:mm' : 'HH:mm'),
        },
      },
    ],
    yAxis: yAxis.length > 0 ? yAxis : [{ type: 'value' }],
    dataZoom: ((xData && xData.length > 10) || (time && time.length > 100))
      ? {
        height: 25,
        start: 0,
        end: (xData && xData.length > 10) ? 500 / xData.length : 25,
        labelFormatter: time ? (_: any, value: string) => moment(Number(value)).format(moreThanOneDay ? moreThanOneDayFormat || 'M/D HH:mm' : 'HH:mm') : null,
      }
      : false,
    grid: {
      right: haveTwoYAxis ? 40 : 5,
    },
    series,
    time,
  };

  if (useBrush) {
    return merge(getDefaultOption(), computedOption, getCustomOption(data, config), option,
      {
        brush: {
          toolbox: [''],
          throttleType: 'debounce',
          xAxisIndex: 0,
        },
        series: [{
          itemStyle: {
            color: '#6CB38B',
          },
          cursor: 'pointer',
        }],
        emphasis: {
          itemStyle: {
            color: '#6CB3AB',
            backgroundColor: '#999',
          },
        },
      });
  }

  return merge(getDefaultOption(), computedOption, getCustomOption(data, config), option);
}
