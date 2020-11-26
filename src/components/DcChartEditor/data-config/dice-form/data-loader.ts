/*
 * Default Data-Converter
 * @Author: licao
 * @Date: 2020-11-25 10:38:15
 * @Last Modified by: licao
 * @Last Modified time: 2020-11-26 19:01:52
 */
import { values, map, merge, filter, get, find } from 'lodash';
import { getChartData } from '../../../../services/chart-editor';
import { MAP_ALIAS } from './constants';

export const createLoadDataFn = ({ api, chartType }: any) => async (payload: any = {}) => {
  const { data } = await getChartData(merge({}, api, { query: payload }));
  if (['chart:line', 'chart:area', 'chart:bar'].includes(chartType)) {
    const { time, results } = data;
    if (results[0].data.length > 1) {
      return {
        time,
        metricData: map(results[0].data, (item) => values(item)[0]),
      };
    } else {
      return {
        time,
        metricData: results[0].data[0],
      };
    }
  }
  if (chartType === 'chart:pie') {
    return {
      metricData: [{
        name: data.title || '',
        data: map(data.metricData, ({ title, value }) => ({ name: title, value })),
      }],
    };
  }
  // 新的统一返回结构
  if (chartType === 'chart:map') {
    const { cols, data: _data } = data;
    const aliases = filter(map(cols, (col) => col.key), (alias) => alias !== MAP_ALIAS);
    const metricData = map(aliases, (alias) => ({
      name: alias,
      data: map(_data, (item) => ({
        name: item[MAP_ALIAS],
        value: item[alias],
      })),
    }));

    return { metricData };
  }

  if (chartType === 'chart:funnel') {
    // 漏斗图：一维，多值
    const xAxis = get(api, ['extraData', 'xAxis', 0, 'fid']);
    // const yAxisKeys = map(get(api, ['extraData', 'activedMetrics']), ({ fid }) => fid);
    const { cols, data: _data } = data;

    // const xAxisCol = find(cols, { key: xAxis });
    const yAxisCols = filter(cols, ({ key }) => key !== xAxis);

    const yAxises = map(yAxisCols, (col) => col.key);
    const metricData = map(yAxises, (yAxis) => ({
      // name: yAxis,
      data: map(_data, (item) => ({
        name: item[xAxis],
        value: item[yAxis],
      })),
    }));

    return { metricData };
  }
  return data;
};
