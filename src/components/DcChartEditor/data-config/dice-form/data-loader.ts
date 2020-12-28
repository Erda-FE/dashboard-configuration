/*
 * Default Data-Converter
 * @Author: licao
 * @Date: 2020-11-25 10:38:15
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-28 17:36:28
 */
import { reduce, map, merge, isEmpty, isMap } from 'lodash';
import { getChartData } from '../../../../services/chart-editor';
import { MAP_ALIAS } from './constants';

export interface ICreateLoadDataFn {
  api: DC.API;
  chartType: DC.ViewType;
  typeDimensions?: DICE_DATA_CONFIGURATOR.Dimension[];
  valueDimensions?: DICE_DATA_CONFIGURATOR.Dimension[];
  isSqlMode?: boolean;
}

export const createLoadDataFn = ({ api, chartType, typeDimensions, valueDimensions, isSqlMode }: ICreateLoadDataFn) => async (payload: any = {}, body?: any) => {
  // 除表格外，其他图表所选值需保证返回值为数值类型
  // if (some(valueDimensions, { fieldType: 'string' }) && chartType !== 'table') return {};
  const { data } = await getChartData(merge({}, api, { query: payload, body }));
  if (isEmpty(data?.data)) return {};

  const _typeDimensions = typeDimensions || [];
  const _valueDimensions = valueDimensions || [];
  const typeDimensionsLen: number = _typeDimensions.length;
  const valueDimensionsLen: number = _valueDimensions.length;
  const isLineType = (['chart:line', 'chart:area', 'chart:bar'] as DC.ViewType[]).includes(chartType);
  const isBarType = chartType === 'chart:bar';
  const isPieType = chartType === 'chart:pie';
  const isMapType = chartType === 'chart:map';
  const isFunnelType = chartType === 'chart:funnel';
  const isMetricCardType = chartType === 'card';
  const isTableType = chartType === 'table';

  if (isTableType) {
    if (isSqlMode) {
      const { data: dataSource, cols } = data;
      return {
        cols: map(cols, (col) => ({ dataIndex: col.key, title: col.key })),
        metricData: map(dataSource, (item, i) => (reduce(cols, (result, { dataIndex }) => ({ ...result, [dataIndex]: item[dataIndex], c_key: i }), {}))),
      };
    } else {
      const { data: dataSource } = data;
      const cols = map([..._typeDimensions, ..._valueDimensions], (item) => ({ dataIndex: item.key, title: item.alias }));

      return {
        cols,
        metricData: map(dataSource, (item, i) => (reduce(cols, (result, { dataIndex }) => ({ ...result, [dataIndex]: item[dataIndex], c_key: i }), {}))),
      };
    }
  }

  // 1个维度，1个或多个数值
  if (typeDimensionsLen === 1 && valueDimensionsLen > 0) {
    // 下面这层数据转化要分离到各个图表组件的 option 中，todo。由于老版本依赖了同一份 option，所以先放在新版 data-loader 中
    if (isLineType) {
      const { cols, data: dataSource } = data;
      const { type, key } = _typeDimensions[0];
      const time = type === 'time' ? map(dataSource, (item) => item[key]) : undefined;
      const xData = (['field', 'expr'] as DICE_DATA_CONFIGURATOR.DimensionMetricType[]).includes(type) ? map(dataSource, (item) => item[key]) : undefined;

      return {
        metricData: map(valueDimensions, (dimension) => {
          return {
            data: map(dataSource, (item) => item[dimension.key]),
            name: dimension.alias,
          };
        }),
        xData,
        time,
      };
    }
  }
  // 0个维度，1个或多个数值
  if (typeDimensionsLen === 0 && valueDimensionsLen > 0) {
    if (isBarType) {
      const { data: dataSource } = data;
      const xData = map(valueDimensions, (item) => item.alias);

      return {
        metricData: [{
          data: map(valueDimensions, (item) => dataSource[0][item.key]),
          // name: dimension.alias,
        }],
        xData,
      };
    }
    if (isPieType || isFunnelType) {
      const { data: dataSource } = data;

      return {
        metricData: [{
          name: '',
          sort: 'none',
          data: map(valueDimensions, (item) => ({ name: item.alias, value: dataSource[0][item.key] })),
        }],
        legendData: map(valueDimensions, (item) => item.alias),
      };
    }
    if (isMetricCardType) {
      const { data: dataSource } = data;

      return {
        metricData: map(valueDimensions, (item) => ({ name: item.alias, value: dataSource[0][item.key] })),
      };
    }
    if (isMapType) {
      const { data: dataSource } = data;

      return {
        metricData: map(valueDimensions, (item) => ({
          name: item.alias,
          data: map(dataSource, (dataItem) => ({
            name: dataItem[MAP_ALIAS],
            value: dataItem[item.key],
          })),
        })),
      };
    }
  }
  // 1个维度，1个数值
  if (typeDimensionsLen === 1 && valueDimensionsLen === 1) {
    if (isPieType || isFunnelType) {
      const { data: dataSource } = data;
      const { key: typeKey } = _typeDimensions[0];
      const { key: valueKey, alias } = _valueDimensions[0];

      return {
        metricData: [{
          name: alias,
          data: map(dataSource, (item) => ({ name: item[typeKey], value: item[valueKey] })),
        }],
        legendData: map(dataSource, (item) => item[typeKey]),
      };
    }
    if (isMetricCardType) {
      const { data: dataSource } = data;
      const { key: typeKey } = _typeDimensions[0];
      const { key: valueKey } = _valueDimensions[0];

      return {
        metricData: map(dataSource, (item) => ({ name: item[typeKey], value: item[valueKey] })),
        legendData: map(dataSource, (item) => item[typeKey]),
      };
    }
  }
  // 1个或多个维度，1个或多个数值
  // eslint-disable-next-line no-empty
  if (typeDimensionsLen > 0 && valueDimensionsLen > 0) {}

  return {};
};
