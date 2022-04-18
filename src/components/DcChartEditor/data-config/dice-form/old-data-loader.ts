/*
 * Default Data-Converter，老版
 * @Author: licao
 * @Date: 2020-11-25 10:38:15
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-27 12:12:59
 */
import { filter, find, get, isEmpty, map, merge, values } from 'lodash';
import { getChartData } from 'src/services/chart-editor';
import { MAP_ALIAS } from './constants';

export const createLoadDataFn =
  ({ api, chartType }: any) =>
  async (payload: any = {}, body?: any) => {
    const { data } = await getChartData(merge({}, api, { query: payload, body }));
    const yAxisInfo = get(api, ['extraData', 'activedMetrics']);
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
        metricData: isEmpty(data.metricData)
          ? []
          : [
              {
                name: data.title || '',
                data: map(data.metricData, ({ title, name, value }) => ({ name: title || name, value })),
              },
            ],
      };
    }
    // 新的统一返回结构
    if (chartType === 'chart:map') {
      const { cols, data: _data } = data;
      const aliases = filter(
        map(cols, (col) => col.key),
        (alias) => alias !== MAP_ALIAS,
      );
      const metricData = map(aliases, (alias) => ({
        name: find(yAxisInfo, { fid: alias })?.alias,
        data: map(_data, (item) => ({
          name: item[MAP_ALIAS],
          value: item[alias],
        })),
      }));

      return { metricData };
    }

    if (chartType === 'chart:funnel') {
      // 漏斗图：0维，多值
      const { data: _data } = data;

      const yAxises = map(yAxisInfo, (col) => col.fid);

      const singleFunnelData = {
        name: '',
        data: map(yAxises, (yAxis) => ({
          name: find(yAxisInfo, { fid: yAxis })?.alias,
          value: _data[0][yAxis],
        })),
      };

      return { metricData: [singleFunnelData] };
    }
    return data;
  };
