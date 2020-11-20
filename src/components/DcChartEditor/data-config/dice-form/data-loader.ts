import { values, map, merge, filter } from 'lodash';
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
  return data;
};
