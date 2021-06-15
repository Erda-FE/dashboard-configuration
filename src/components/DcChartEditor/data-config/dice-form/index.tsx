/* 数据源配置器
 * @Author: licao
 * @Date: 2020-12-23 19:36:48
 * @Last Modified by: licao
 * @Last Modified time: 2021-01-28 18:48:45
 */
import React, { useMemo, useCallback, useRef } from 'react';
import { useMount } from 'react-use';
import { map, forEach, find, reduce, isEmpty, keyBy, debounce, isNumber } from 'lodash';
import produce from 'immer';
import { Switch, Cascader, Input, InputNumber, Select } from '@terminus/nusi';
import { getConfig } from '../../../../config';
// import { useLoading } from '../../../../common/stores/loading';
import { DcFormBuilder, DcInfoLabel } from '../../../../common';
import { insertWhen } from '../../../../common/utils';
import { getIntervalString } from './common/utils';
import { CUSTOM_TIME_RANGE_MAP, MAP_LEVEL, MAP_ALIAS, SQL_OPERATOR } from './constants';
// import DynamicFilterDataModal from './dynamic-filter-data-modal';
import { createLoadDataFn } from './data-loader';
import SwitchChartType from '../../switch-chart-type';
import DimensionsConfigurator from './dimensions-configurator';
import ChartEditorStore from '../../../../stores/chart-editor';
import DashboardStore from '../../../../stores/dash-board';
import { customFilter, defaultRenderFilteredOption } from '../../../../utils/cascaderFilter';
import './index.scss';
import { DC, CreateLoadDataParams } from 'src/types';

const textMap = DashboardStore.getState((s) => s.textMap);

interface IProps {
  currentChart: DC.View;
  submitResult: (payload: Partial<DC.View>) => void;
}

const DiceForm = ({ submitResult, currentChart }: IProps) => {
  const timeSpan = ChartEditorStore.useStore((s) => s.timeSpan);
  // const [isFetchingMetaGroups] = useLoading(dataConfigMetaDataStore, ['getMetaGroups']);
  // 配置所需的数据，宿主注入
  const { dataConfigMetaDataStore, scope, scopeId, loadDataApi } = getConfig('diceDataConfigProps');
  const { getMetaGroups, getMetaData } = dataConfigMetaDataStore.effects;
  const [
    metaGroups,
    metaConstantMap,
    metaMetrics,
  ] = dataConfigMetaDataStore.useStore((s: any) => [
    s.metaGroups,
    s.metaConstantMap,
    s.metaMetrics,
  ]);
  const ref = useRef(null as any);

  // 配置所需的数据计算
  const fieldsMap = useMemo(() => reduce(metaMetrics, (result, value) => {
    const { fields, tags, metric, filters } = value;
    const singleFieldsMap = reduce(fields, (acc, field) => ({ ...acc, [`${metric}-${field.key}`]: { ...field, tags, metric, filters } }), {});
    return { ...result, ...singleFieldsMap };
  }, {}), [metaMetrics]);
  const curMetric = metaMetrics ? metaMetrics[0] : {};
  const { types: typeMap } = metaConstantMap;

  const aggregationMap = useMemo(() => reduce(typeMap, (result, { aggregations }) => ({ ...result, ...keyBy(aggregations, 'aggregation') }), {}), [typeMap]);
  const filtersMap = useMemo(() => reduce(typeMap, (result, { filters }) => ({ ...result, ...keyBy(filters, 'operation') }), {}), [typeMap]);

  // 图表信息
  const { chartType, curMapType = [], config: currentChartConfig = {} } = currentChart;
  const { dataSourceConfig } = currentChartConfig;
  const dataSource = useMemo(() => (dataSourceConfig || {}) as DC.DatasourceConfig, [dataSourceConfig]);
  const [mapLevel, preLevel] = useMemo(() => [MAP_LEVEL[curMapType.length - 1], MAP_LEVEL[curMapType.length - 2]], [curMapType.length]);
  const isTableType = chartType === 'table';
  const isMapType = chartType === 'chart:map';
  const isLineType = (['chart:line', 'chart:area', 'chart:bar'] as DC.ViewType[]).includes(chartType);
  const sqlContent = dataSource?.sql || {};
  const _submitResult = debounce(submitResult, 500);

  useMount(() => {
    getMetaGroups({ scope, scopeId, version: 'v2' });
    handleGetMetaData(dataSourceConfig?.activedMetricGroups);
  });

  const _getMetaData = (_activedMetricGroups: string[]) => getMetaData({
    scope,
    scopeId,
    groupId: _activedMetricGroups[_activedMetricGroups.length - 1],
    version: 'v2',
  });

  const handleGetMetaData = (_activedMetricGroups?: string[]) => {
    _activedMetricGroups && !isEmpty(_activedMetricGroups) && _getMetaData(_activedMetricGroups);
  };

  const getTimeRange = useCallback((_customTime?: string) => {
    if (_customTime) {
      const [start, end] = CUSTOM_TIME_RANGE_MAP[_customTime].getTimeRange();
      return { start, end };
    }
    const { startTimeMs, endTimeMs } = timeSpan;
    return {
      start: startTimeMs,
      end: endTimeMs,
    };
  }, [timeSpan]);

  const getDefaultFilter = useCallback(() => {
    return reduce(curMetric?.filters, (result, { tag, op, value }) => ({
      ...result,
      [`${op}_${tag}`]: value,
    }), {});
  }, [curMetric?.filters]);

  const getDSLFilters = useCallback((dimensions: DICE_DATA_CONFIGURATOR.Dimension[]) => {
    if (isEmpty(dimensions)) return;
    return map(dimensions, ({ type, field, filter, expr }) => {
      if (type === 'filter') {
        return `${fieldsMap[field as string]?.key}${filter?.operation}${
          isNumber(filter?.value)
            ? filter?.value
            // 正则表达式特殊处理下
            : filter?.operation === '=~'
              ? `/${filter?.value}/`
              : `'${filter?.value}'`
        }`;
      } else if (type === 'expr') {
        return expr;
      }
      return '';
    });
  }, [fieldsMap]);

  const getDSLSelects = useCallback((dimensions: DICE_DATA_CONFIGURATOR.Dimension[], isAutoPrecision?: boolean) => (isEmpty(dimensions)
    ? []
    : [
      ...map(dimensions, ({ type, field, aggregation, key, expr: _expr, resultType }) => {
        let expr;
        switch (type) {
          case 'expr':
            expr = _expr;
            break;
          case 'time':
            expr = 'time()';
            break;
          case 'field':
            expr = aggregation
              ?
              isAutoPrecision && resultType === 'number'
                ? `round_float(${aggregation}(${fieldsMap[field as string]?.key}), 2)` // 自动处理返回值精度问题，后面需自动处理
                : `${aggregation}(${fieldsMap[field as string]?.key})`
              :
              isAutoPrecision && resultType === 'number'
                ? `round_float(${fieldsMap[field as string]?.key}, 2)`
                : fieldsMap[field as string]?.key;
            break;
          default:
            break;
        }
        return {
          expr,
          alias: key,
        };
      }),
      // 地图处理
      ...insertWhen(isMapType, [
        { expr: `${mapLevel}::tag`, alias: MAP_ALIAS },
      ]),
    ]
  ), [fieldsMap, isMapType, mapLevel]);

  const getDSLGroupBy = useCallback((dimensions: DICE_DATA_CONFIGURATOR.Dimension[]) => {
    return isMapType
      // 地图下钻产生的值 => 需要获取图表信息
      ? [mapLevel]
      : isEmpty(dimensions)
        ? undefined
        : map(dimensions, ({ type, field, expr, timeInterval }) => {
          let val;
          switch (type) {
            case 'time':
              val = (timeInterval?.value && timeInterval?.unit) ? `time(${getIntervalString(timeInterval)})` : 'time()';
              break;
            case 'field':
              val = fieldsMap[field as string]?.key;
              break;
            case 'expr':
              val = expr;
              break;
            default:
              break;
          }
          return val;
        });
  }, [fieldsMap, isMapType, mapLevel]);

  const getDSLOrderBy = useCallback((dimensions: DICE_DATA_CONFIGURATOR.Dimension[]) => {
    return isEmpty(dimensions)
      ? undefined
      : map(dimensions, ({ type, field, aggregation, expr: _expr, sort }) => {
        let expr;
        switch (type) {
          case 'expr':
            expr = _expr;
            break;
          case 'sort':
            expr = aggregation
              ? `${aggregation}(${fieldsMap[field as string]?.key})`
              : fieldsMap[field as string]?.key;
            break;
          default:
            break;
        }
        return {
          expr,
          dir: sort,
        };
      });
  }, [fieldsMap]);

  const getLoadData = useCallback((payload: Omit<CreateLoadDataParams, 'chartType'>) => {
    return createLoadDataFn({
      ...payload,
      chartType,
    } as any);
  }, [chartType]);

  const getSqlString = (sql?: DC.SqlContent) => {
    if (!sql) return '';
    const sqlStr = reduce(SQL_OPERATOR, (result, operator, key) => {
      return `${result}${sql[key] ? `${operator} ${sql[key]} ` : ''}`;
    }, '');
    return sqlStr;
  };

  const genApi = useCallback(({
    typeDimensions,
    valueDimensions,
    sortDimensions,
    resultFilters,
    isSqlMode,
    customTime,
    sql,
    limit,
  }: DC.DatasourceConfig): DC.API => {
    const { url, query } = loadDataApi;
    return {
      url,
      method: isSqlMode ? 'get' : 'post',
      query: {
        format: 'chartv2',
        ql: isSqlMode ? 'influxql' : 'influxql:ast',
        q: isSqlMode ? getSqlString(sql) : undefined,
        type: '_',
        epoch: !isTableType ? 'ms' : undefined,
        time_field: find(typeDimensions, { type: 'time' })?.timeField?.value,
        time_unit: find(typeDimensions, { type: 'time' })?.timeField?.unit,
        ...getDefaultFilter(),
        ...getTimeRange(customTime),
        ...query,
      },
      body: isSqlMode
        ? undefined
        :
        {
          from: curMetric?.metric ? [curMetric?.metric] : undefined,
          select: [...getDSLSelects(typeDimensions || []), ...getDSLSelects(valueDimensions || [], true)],
          where: getDSLFilters(resultFilters as DICE_DATA_CONFIGURATOR.Dimension[]),
          groupby: getDSLGroupBy(typeDimensions as DICE_DATA_CONFIGURATOR.Dimension[]),
          orderby: getDSLOrderBy(sortDimensions as DICE_DATA_CONFIGURATOR.Dimension[]),
          // 0个维度且有1个或多个多个值，limit为1，返回最新值
          limit: limit || (((typeDimensions || []).length < 1 && (valueDimensions || []).length > 0) && !isMapType && !isTableType ? 1 : undefined),
        },
    };
  }, [loadDataApi, isTableType, getDefaultFilter, getTimeRange, curMetric?.metric, getDSLSelects, getDSLFilters, getDSLGroupBy, getDSLOrderBy, isMapType]);

  const handleUpdateDataSource = useCallback((_dataSource: Partial<DC.DatasourceConfig>, otherProps?: object) => {
    const newDataSource = produce(dataSource, (draft) => {
      forEach(_dataSource, (v, k) => { draft[k] = v; });
    });

    const _api = genApi(newDataSource);
    _submitResult({
      config: produce(currentChartConfig, (draft) => {
        draft.dataSourceConfig = newDataSource;
        const moreThanOneDayFormat = find(draft.dataSourceConfig.typeDimensions, { type: 'time' })?.timeFormat;
        if (moreThanOneDayFormat) {
          const optionProps = draft.optionProps || {};
          draft.optionProps = { ...optionProps, moreThanOneDayFormat };
        }
      }),
      api: _api,
      ...otherProps,
      loadData: getLoadData({ api: _api, ...newDataSource }),
    });
  }, [_submitResult, dataSource, currentChartConfig, genApi, getLoadData]);

  const handleUpdateChartType = (type: DC.ViewType) => {
    if (type === 'table') {
      _submitResult({ chartType: type });
    } else {
      handleUpdateDataSource({ isSqlMode: false }, { chartType: type });
    }
  };

  const handleUpdateSqlContent = (_dataSource: Partial<DC.SqlContent>) => {
    const sql = produce(dataSource.sql || {}, (draft) => {
      forEach(_dataSource, (v, k) => { draft[k] = v; });
    });
    handleUpdateDataSource({ sql });
  };

  const fieldsList = [
    {
      label: textMap['configuration mode'],
      type: Switch,
      name: 'isSqlMode',
      required: false,
      show: () => isTableType,
      customProps: {
        checked: dataSource?.isSqlMode,
        checkedChildren: 'SQL',
        unCheckedChildren: textMap.dsl,
        onChange: (checked: boolean) => handleUpdateDataSource({ isSqlMode: checked }),
      },
    },
    {
      label: textMap['chart type'],
      name: 'chartType',
      initialValue: chartType,
      required: false,
      type: SwitchChartType,
      customProps: {
        onChange: (v: DC.ViewType) => handleUpdateChartType(v),
        typeDimensions: dataSource.typeDimensions,
        valueDimensions: dataSource.valueDimensions,
      },
    },
    {
      label: 'SELECT',
      name: 'SELECT',
      type: Input,
      initialValue: sqlContent.select,
      show: () => dataSource.isSqlMode,
      customProps: {
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          handleUpdateSqlContent({ select: e.target.value });
        },
      },
    },
    {
      label: 'FROM',
      type: Cascader,
      name: 'FROM',
      show: () => dataSource.isSqlMode,
      initialValue: sqlContent.fromSource,
      customProps: {
        allowClear: false,
        showSearch: { filter: customFilter, render: defaultRenderFilteredOption },
        options: metaGroups,
        onChange: (v: string[]) => {
          _getMetaData(v).then((res?: Array<{ metric: string }>) => {
            handleUpdateSqlContent({
              from: res ? res[0]?.metric : '',
              fromSource: v,
            });
          });
        },
      },
    },
    {
      label: 'WHERE',
      name: 'WHERE',
      type: Input,
      required: false,
      initialValue: sqlContent.where,
      show: () => dataSource.isSqlMode,
      customProps: {
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          handleUpdateSqlContent({ where: e.target.value });
        },
      },
    },
    {
      label: 'GROUP BY',
      name: 'GROUP BY',
      type: Input,
      required: false,
      initialValue: sqlContent.groupBy,
      show: () => dataSource.isSqlMode,
      customProps: {
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          handleUpdateSqlContent({ groupBy: e.target.value });
        },
      },
    },
    {
      label: 'ORDER BY',
      name: 'ORDER BY',
      type: Input,
      required: false,
      initialValue: sqlContent.orderBy,
      show: () => dataSource.isSqlMode,
      customProps: {
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          handleUpdateSqlContent({ orderBy: e.target.value });
        },
      },
    },
    {
      label: 'LIMIT',
      name: 'LIMIT',
      type: InputNumber,
      required: false,
      initialValue: sqlContent.limit,
      show: () => dataSource.isSqlMode,
      customProps: {
        min: 1,
        precision: 0,
        onChange: (v: number) => handleUpdateSqlContent({ limit: v }),
      },
    },
    {
      label: textMap['metrics group'],
      type: Cascader,
      name: 'activedMetricGroups',
      show: () => !dataSource.isSqlMode,
      initialValue: dataSource?.activedMetricGroups,
      customProps: {
        allowClear: false,
        showSearch: { filter: customFilter, render: defaultRenderFilteredOption },
        options: metaGroups,
        onChange: (v: string[]) => {
          handleUpdateDataSource({ activedMetricGroups: v });
          !dataSource?.isSqlMode && handleGetMetaData(v);
        },
      },
    },
    {
      label: isLineType ? <DcInfoLabel text={textMap.dimensions} info={textMap['typeDimensions info']} /> : textMap.dimensions,
      name: 'typeDimensions',
      initialValue: dataSource?.typeDimensions,
      required: false,
      show: () => !dataSource.isSqlMode,
      type: DimensionsConfigurator,
      customProps: {
        type: 'type',
        addText: textMap['add metric'],
        disabled: isEmpty(dataSource.activedMetricGroups),
        metricsMap: fieldsMap,
        typeMap,
        aggregationMap,
        filtersMap,
        onChange: (v: DICE_DATA_CONFIGURATOR.Dimension[]) => handleUpdateDataSource({ typeDimensions: v }),
      },
    },
    {
      label: <DcInfoLabel text={textMap.value} info={textMap['valueDimensions info']} />,
      name: 'valueDimensions',
      initialValue: dataSource?.valueDimensions,
      required: false,
      show: () => !dataSource.isSqlMode,
      type: DimensionsConfigurator,
      customProps: {
        type: 'value',
        addText: textMap['add value'],
        disabled: isEmpty(dataSource.activedMetricGroups),
        metricsMap: fieldsMap,
        typeMap,
        aggregationMap,
        filtersMap,
        onChange: (v: DICE_DATA_CONFIGURATOR.Dimension[]) => handleUpdateDataSource({ valueDimensions: v }),
      },
    },
    {
      label: textMap['result filter'],
      name: 'resultFilters',
      initialValue: dataSource?.resultFilters,
      required: false,
      show: () => !dataSource.isSqlMode,
      type: DimensionsConfigurator,
      customProps: {
        type: 'filter',
        addText: textMap['add filter'],
        disabled: isEmpty(dataSource.activedMetricGroups),
        metricsMap: fieldsMap,
        typeMap,
        aggregationMap,
        filtersMap,
        onChange: (v: DICE_DATA_CONFIGURATOR.Dimension[]) => handleUpdateDataSource({ resultFilters: v }),
      },
    },
    {
      label: textMap.sort,
      name: 'sortDimensions',
      initialValue: dataSource?.sortDimensions,
      required: false,
      show: () => !dataSource.isSqlMode,
      type: DimensionsConfigurator,
      customProps: {
        type: 'sort',
        addText: textMap['add sort'],
        disabled: isEmpty(dataSource.activedMetricGroups),
        metricsMap: fieldsMap,
        typeMap,
        aggregationMap,
        filtersMap,
        onChange: (v: DICE_DATA_CONFIGURATOR.Dimension[]) => handleUpdateDataSource({ sortDimensions: v }),
      },
    },
    {
      label: textMap['result limit'],
      name: 'limit',
      type: InputNumber,
      required: false,
      initialValue: dataSource?.limit,
      show: () => !dataSource.isSqlMode,
      customProps: {
        min: 1,
        precision: 0,
        onChange: (v: number) => handleUpdateDataSource({ limit: v }),
      },
    },
    {
      label: textMap['fixed time range'],
      type: Select,
      name: 'customTime',
      initialValue: dataSource?.customTime,
      required: false,
      customProps: {
        options: map(CUSTOM_TIME_RANGE_MAP, ({ name: label }, value) => ({ label, value })),
        allowClear: true,
        onChange: (v: string) => handleUpdateDataSource({ customTime: v }),
      },
    },
  ];

  return (
    <div className="dc-dice-metrics-form">
      <DcFormBuilder fields={fieldsList} ref={ref} />
      {/* <DynamicFilterDataModal
        title="动态过滤数据源配置"
        visible={dynamicFilterDataModalVisible}
        isV2Type={isV2Type}
        defaultValue={dynamicFilterDataAPI?.extraData}
        onCancel={() => update({ dynamicFilterDataModalVisible: false })}
        getTimeRange={getTimeRange}
        onOk={(apis) => { update({ dynamicFilterDataAPI: apis }); }}
      /> */}
    </div>
  );
};

export default DiceForm;
