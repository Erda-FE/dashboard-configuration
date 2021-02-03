/*
 * Default Data-Converter
 * @Author: licao
 * @Date: 2020-11-25 10:38:15
 * @Last Modified by: licao
 * @Last Modified time: 2021-01-30 21:27:55
 */
import { reduce, map, merge, isEmpty, dropWhile, find, uniqBy, chunk, keyBy } from 'lodash';
import { getChartData } from '../../../../services/chart-editor';
import { getFormatter } from '../../../../common/utils';
import { MAP_ALIAS, CUSTOM_TIME_RANGE_MAP } from './constants';

export interface ICreateLoadDataFn {
  api: DC.API;
  chartType: DC.ViewType;
  typeDimensions?: DICE_DATA_CONFIGURATOR.Dimension[];
  valueDimensions?: DICE_DATA_CONFIGURATOR.Dimension[];
  isSqlMode?: boolean;
  customTime?: string;
}

export const createLoadDataFn = ({ api, chartType, typeDimensions, valueDimensions, isSqlMode, customTime }: ICreateLoadDataFn) => async (payload: any = {}, body?: any) => {
  // 固定时间范围查询逻辑 customTime
  let customTimeResult = {};
  if (customTime) {
    const [a, b] = CUSTOM_TIME_RANGE_MAP[customTime].getTimeRange();
    customTimeResult = {
      start: a,
      end: b,
    };
  }
  const { data } = await getChartData(merge(
    {},
    api,
    {
      query: {
        ...customTimeResult,
        ...payload,
      },
      body,
    }
  ));
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
      const _cols = map(cols, (col) => ({ dataIndex: col.key, title: col.key }));

      return {
        cols: _cols,
        metricData: map(dataSource, (item, k) => (reduce(_cols, (result, { dataIndex }) => ({ ...result, [dataIndex]: item[dataIndex], c_key: k }), {}))),
      };
    } else {
      const { data: dataSource } = data;
      const _valueDimensionMap = keyBy(_valueDimensions, 'key');
      const cols = map([..._typeDimensions, ..._valueDimensions], ({ key, alias }) => ({
        dataIndex: key,
        title: alias,
      }));

      return {
        cols,
        metricData: map(dataSource, (item, i) => (
          reduce(cols, (result, { dataIndex }) => {
            const getFormattedVal = (val: any) => {
              const unit = _valueDimensionMap[dataIndex]?.unit;
              if (!unit?.type || !unit?.unit || (typeof val !== 'number')) return val;

              return getFormatter(unit.type, unit.unit).format(val, 2);
            };

            return {
              ...result,
              [dataIndex]: getFormattedVal(item[dataIndex]),
              c_key: i,
            };
          }, {})
        )),
      };
    }
  }

  // 1个维度，1个或多个数值
  if (typeDimensionsLen === 1 && valueDimensionsLen > 0) {
    // 下面这层数据转化要分离到各个图表组件的 option 中，todo。由于老版本依赖了同一份 option，所以先放在新版 data-loader 中
    if (isLineType) {
      const { data: dataSource } = data;
      const { type, key } = _typeDimensions[0];
      const time = type === 'time' ? map(dataSource, (item) => item[key]) : undefined;
      const xData = (['field', 'expr'] as DICE_DATA_CONFIGURATOR.DimensionMetricType[]).includes(type) ? map(dataSource, (item) => item[key]) : undefined;

      return {
        metricData: map(_valueDimensions, (dimension) => {
          return {
            data: map(dataSource, (item) => item[dimension.key]),
            name: dimension.alias,
            ...dimension,
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
      const xData = map(_valueDimensions, (item) => item.alias);

      return {
        metricData: [{
          data: map(_valueDimensions, (item) => dataSource[0][item.key]),
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
          data: map(_valueDimensions, (item) => ({ name: item.alias, value: dataSource[0][item.key] })),
        }],
        legendData: map(_valueDimensions, (item) => item.alias),
        unit: _valueDimensions[0].unit,
      };
    }
    if (isMetricCardType) {
      const { data: dataSource } = data;

      return {
        metricData: map(_valueDimensions, (item) => ({ name: item.alias, value: dataSource[0][item.key], unit: item.unit })),
      };
    }
    if (isMapType) {
      const { data: dataSource } = data;

      return {
        metricData: map(_valueDimensions, (item) => ({
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
      const { key: valueKey, alias, unit } = _valueDimensions[0];

      return {
        metricData: [{
          name: alias,
          data: map(dataSource, (item) => ({ name: item[typeKey], value: item[valueKey] })),
        }],
        legendData: map(dataSource, (item) => item[typeKey]),
        unit,
      };
    }
    if (isMetricCardType) {
      const { data: dataSource } = data;
      const { key: typeKey } = _typeDimensions[0];
      const { key: valueKey, unit } = _valueDimensions[0];

      return {
        metricData: map(dataSource, (item) => ({ name: item[typeKey], value: item[valueKey], unit })),
        legendData: map(dataSource, (item) => item[typeKey]),
      };
    }
  }
  // 多个维度，1个数值
  if (typeDimensionsLen > 1 && valueDimensionsLen === 1) {
    if (isLineType) {
      const { data: dataSource } = data;
      const timeDimension = find(_typeDimensions, { type: 'time' });
      if (!timeDimension) return {};

      const valueDimension = _valueDimensions[0];
      const otherDimensions = dropWhile(_typeDimensions, { type: 'time' });
      const time = map(uniqBy(dataSource, timeDimension.key), (item) => item[timeDimension.key]);
      const groups = chunk(dataSource, time.length);
      const metricData = map(groups, (group) => {
        const nameItem: any = find(group, (item: any) => !!item[valueDimension.key]) || {};
        return {
          data: map(group, (item: any) => item[valueDimension.key]),
          name: reduce(otherDimensions, (name, { key }, index) => `${name}${nameItem[key]}${index !== otherDimensions.length - 1 ? ' / ' : ''}`, ''),
          ...valueDimension,
        };
      });

      return {
        metricData,
        time,
        valueNames: [valueDimension.alias],
      };
    }
  }

  return {};
};
