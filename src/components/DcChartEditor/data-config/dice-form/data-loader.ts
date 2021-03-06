/*
 * Default Data-Converter
 * @Author: licao
 * @Date: 2020-11-25 10:38:15
 * @Last Modified by: licao
 * @Last Modified time: 2021-02-25 12:38:00
 */
import { chunk, dropWhile, find, forEach, isEmpty, isNumber, keyBy, map, merge, reduce, uniqBy } from 'lodash';
import { getChartData } from 'src/services/chart-editor';
import { getFormatter } from 'src/common/utils';
import { customTimeRangeMap, MAP_ALIAS } from './constants';
import DashboardStore from 'src/stores/dash-board';

export const createLoadDataFn =
  ({ api, chartType, typeDimensions, valueDimensions, isSqlMode, customTime }: DC.CreateLoadDataParams) =>
  async (payload: any = {}, body?: any) => {
    const [textMap, locale] = DashboardStore.getState((s) => [s.textMap, s.locale]);
    // 固定时间范围查询逻辑 customTime
    let customTimeResult = {};
    if (customTime) {
      const [a, b] = customTimeRangeMap(textMap)[customTime].getTimeRange();
      customTimeResult = {
        start: a,
        end: b,
      };
    }
    const { data } = await getChartData(
      merge({}, api, {
        query: {
          ...customTimeResult,
          ...payload,
        },
        body,
      }),
    );
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
        const _cols = map(cols, (col) => ({
          dataIndex: col.key,
          title: col.key,
          width: col.width,
          copy: col.copy,
        }));

        return {
          cols: _cols,
          metricData: map(dataSource, (item, k) =>
            reduce(
              _cols,
              (result, { dataIndex }) => ({
                ...result,
                [dataIndex]: item[dataIndex],
                c_key: k,
              }),
              {
                ...item,
              },
            ),
          ),
          dataSource,
        };
      } else {
        const { data: dataSource } = data;
        const _valueDimensionMap = keyBy(_valueDimensions, 'key');
        const cols = map([..._typeDimensions, ..._valueDimensions], ({ key, alias, i18n, width, copy }) => ({
          dataIndex: key,
          title: i18n?.alias?.[locale] ?? alias,
          width,
          copy,
        }));

        return {
          cols,
          metricData: map(dataSource, (item, i) =>
            reduce(
              cols,
              (result, { dataIndex }) => {
                const getFormattedVal = (val: any) => {
                  const unit = _valueDimensionMap[dataIndex]?.unit;
                  if (!unit?.type || !unit?.unit || typeof val !== 'number') return val;

                  return getFormatter(unit.type, unit.unit).format(val, 2);
                };

                return {
                  ...result,
                  [dataIndex]: getFormattedVal(item[dataIndex]),
                  c_key: i,
                };
              },
              { ...item },
            ),
          ),
          dataSource,
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
        const xData = (['field', 'expr'] as DICE_DATA_CONFIGURATOR.DimensionMetricType[]).includes(type)
          ? map(dataSource, (item) => item[key])
          : undefined;
        return {
          metricData: map(_valueDimensions, (dimension, dimensionIndex) => {
            return {
              data: map(dataSource, (item) => item[dimension.key]),
              name: dimension?.i18n?.alias?.[locale] ?? dimension?.alias,
              ...dimension,
              axisIndex: dimensionIndex,
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
        const xData = map(_valueDimensions, (item) => item?.i18n?.alias?.[locale] ?? item?.alias);

        return {
          metricData: [
            {
              data: map(_valueDimensions, (item) => dataSource[0][item.key]),
              // name: dimension.alias,
            },
          ],
          xData,
        };
      }
      if (isPieType || isFunnelType) {
        const { data: dataSource } = data;

        return {
          metricData: [
            {
              name: '',
              sort: 'none',
              data: map(_valueDimensions, (item) => ({
                name: item?.i18n?.alias?.[locale] ?? item.alias,
                value: dataSource[0][item.key],
              })),
            },
          ],
          legendData: map(_valueDimensions, (item) => item?.i18n?.alias?.[locale] ?? item?.alias),
          unit: _valueDimensions[0].unit,
        };
      }
      if (isMetricCardType) {
        const val = data.data[0];
        const metricData = map(_valueDimensions, (item) => ({
          name: item?.i18n?.alias?.[locale] ?? item?.alias,
          value: val[item.key],
          unit: item.unit,
        }));
        return { metricData };
      }
      if (isMapType) {
        const { data: dataSource } = data;

        return {
          metricData: map(_valueDimensions, (item) => ({
            name: item?.i18n?.alias?.[locale] ?? item?.alias,
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
        const { key: valueKey, alias, unit, i18n } = _valueDimensions[0];

        return {
          metricData: [
            {
              name: alias,
              data: map(dataSource, (item) => ({
                name: i18n?.[typeKey]?.[locale] ?? item[typeKey],
                value: item[valueKey],
              })),
            },
          ],
          legendData: map(dataSource, (item) => i18n?.[typeKey]?.[locale] ?? item[typeKey]),
          unit,
        };
      }
      if (isMetricCardType) {
        const { data: dataSource } = data;
        const { key: typeKey } = _typeDimensions[0];
        const { key: valueKey, unit, i18n } = _valueDimensions[0];

        return {
          metricData: map(dataSource, (item) => ({
            name: i18n?.[typeKey]?.[locale] ?? item[typeKey],
            value: item[valueKey],
            unit,
          })),
          legendData: map(dataSource, (item) => i18n?.[typeKey]?.[locale] ?? item[typeKey]),
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
        const alias = valueDimension?.i18n?.alias?.[locale] ?? valueDimension?.alias;
        const metricData = map(groups, (group) => {
          const nameItem: any =
            find(
              group,
              (item: any) =>
                (!!item[valueDimension.key] || isNumber(item[valueDimension.key])) &&
                Object.values(item).every((value) => value !== null),
            ) || {};
          return {
            data: map(group, (item: any) => item[valueDimension.key]),
            name: reduce(
              otherDimensions,
              (name, { key }, index) => `${name}${nameItem[key]}${index !== otherDimensions.length - 1 ? ' / ' : ''}`,
              '',
            ),
            ...valueDimension,
            alias,
          };
        });
        return {
          metricData,
          time,
          valueNames: [alias],
        };
      }
    }

    // 多个维度，多个数值
    if (typeDimensionsLen > 1 && valueDimensionsLen > 1) {
      if (isLineType) {
        const { data: dataSource } = data;
        const timeDimension = find(_typeDimensions, { type: 'time' });
        if (!timeDimension) return {};

        const otherDimensions = dropWhile(_typeDimensions, { type: 'time' });
        const time = map(uniqBy(dataSource, timeDimension.key), (item) => item[timeDimension.key]);
        const metricData: any = [];
        const groups = chunk(dataSource, time.length);
        forEach(groups, (group) => {
          forEach(_valueDimensions, (valueDimension, dimensionIndex) => {
            const nameItem: any =
              find(
                group,
                (item: any) =>
                  (!!item[valueDimension.key] || isNumber(item[valueDimension.key])) &&
                  Object.values(item).every((value) => value !== null),
              ) || {};

            metricData.push({
              data: map(group, (item: any) => item[valueDimension.key]),
              name: reduce(
                otherDimensions,
                (name, { key }, index) => `${name}${nameItem[key]}${index !== otherDimensions.length - 1 ? ' / ' : ''}`,
                '',
              ),
              ...valueDimension,
              alias: valueDimension?.i18n?.alias?.[locale] ?? valueDimension?.alias,
              axisIndex: dimensionIndex,
            });
          });
        });

        return {
          metricData,
          time,
          valueNames: _valueDimensions.map((x) => x?.i18n?.alias?.[locale] ?? x.alias),
        };
      }
    }
    return {};
  };
