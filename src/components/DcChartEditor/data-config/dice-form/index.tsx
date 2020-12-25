/* 数据源配置器
 * @Author: licao
 * @Date: 2020-12-23 19:36:48
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-25 19:50:52
 */
import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { useMount } from 'react-use';
import { map, forEach, find, reduce, isEmpty, keyBy, debounce, isNumber } from 'lodash';
import produce from 'immer';
import { Switch, Cascader, Input } from '@terminus/nusi';
import { getConfig } from '../../../../config';
// import { useLoading } from '../../../../common/stores/loading';
import { DcFormBuilder, DcInfoLabel } from '../../../../common';
import { insertWhen } from '../../../../common/utils';
import { CUSTOM_TIME_RANGE_MAP, MAP_LEVEL, MAP_ALIAS } from './constants';
// import DynamicFilterDataModal from './dynamic-filter-data-modal';
import { createLoadDataFn, ICreateLoadDataFn } from './data-loader';
import DimensionsConfigurator from './dimensions-configurator';
import ChartEditorStore from '../../../../stores/chart-editor';
import DashboardStore from '../../../../stores/dash-board';

import './index.scss';

const { TextArea } = Input;
const textMap = DashboardStore.getState((s) => s.textMap);

interface IProps {
  currentChart: DC.View;
  submitResult: (payload: Partial<DC.View>) => void;
}

const DiceForm = ({ submitResult, currentChart }: IProps) => {
  const timeSpan = ChartEditorStore.useStore((s) => s.timeSpan);
  // const [isFetchingMetaGroups] = useLoading(dataConfigMetaDataStore, ['getMetaGroups']);
  // 配置所需的数据，宿主注入
  const { dataConfigMetaDataStore, scope, scopeId } = getConfig('diceDataConfigProps');
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

  const { types: typeMap } = metaConstantMap;

  const aggregationMap = useMemo(() => reduce(typeMap, (result, { aggregations }) => ({ ...result, ...keyBy(aggregations, 'aggregation') }), {}), [typeMap]);
  const filtersMap = useMemo(() => reduce(typeMap, (result, { filters }) => ({ ...result, ...keyBy(filters, 'operation') }), {}), [typeMap]);

  // 图表信息
  const { chartType, curMapType = [], config: currentChartConfig = {} } = currentChart;
  const { dataSourceConfig } = currentChartConfig;
  const [mapLevel, preLevel] = useMemo(() => [MAP_LEVEL[curMapType.length - 1], MAP_LEVEL[curMapType.length - 2]], [curMapType.length]);
  const isTableType = chartType === 'table';
  const isMapType = chartType === 'chart:map';
  // 新增的散点图、地图采用新的拼接规则和返回结构
  const loadDataUrl = '/api/query';
  const dataSource = useMemo(() => (dataSourceConfig || {}) as DC.DatasourceConfig, [dataSourceConfig]);

  const _submitResult = debounce(submitResult, 500);

  useMount(() => {
    getMetaGroups({ scope, scopeId, version: 'v2' });
    handleGetMetaData(dataSourceConfig?.activedMetricGroups);
  });

  const handleGetMetaData = (_activedMetricGroups?: string[]) => {
    _activedMetricGroups && !isEmpty(_activedMetricGroups) && getMetaData({
      scope,
      scopeId,
      groupId: _activedMetricGroups[_activedMetricGroups.length - 1],
      version: 'v2',
    });
  };

  // 表达式拼接规则：https://yuque.antfin-inc.com/docs/share/f9069b1a-5110-4954-b427-9bed97afd593#WmfAm
  const getFilterExpressions = (_filters: any[]) => {
    let filterExpressions = map(_filters, ({ tag, method, value }) => `${tag}${method}${isNumber(value) ? value : `'${value}'`}`);
    filterExpressions = [
      ...filterExpressions,
      // 地图处理
      ...insertWhen(isMapType && !!preLevel, [`${preLevel}='${curMapType[curMapType.length - 1]}'`]),
    ];
    return isEmpty(filterExpressions) ? undefined : filterExpressions;
  };

  const getTimeRange = useCallback(() => {
    const _customTime = find(dataSource.typeDimensions, { type: 'time' })?.customTime;
    if (_customTime) {
      const [start, end] = CUSTOM_TIME_RANGE_MAP[_customTime].getTimeRange();
      return { start, end };
    }
    const { startTimeMs, endTimeMs } = timeSpan;
    return {
      start: startTimeMs,
      end: endTimeMs,
    };
  }, [dataSource.typeDimensions, timeSpan]);

  // // Sql 模式只在表格图中出现
  // useEffect(() => {
  //   if (isSqlMode) {
  //     if (!q) return;

  //     const _api = {
  //       url: initialUrl.replace(/{{metricName}}/g, defaultMetric.metric),
  //       method: 'GET',
  //       query: {
  //         q,
  //         ...reduce(defaultMetric.filters, (acc, { tag, op, value }) => ({ ...acc, [`${op}_tag.${tag}`]: value }), {}),
  //         format: 'chartv2',
  //         time_field,
  //         ...getTimeRange(),
  //         filter__metric_scope: scope,
  //         filter__metric_scope_id: scopeId,
  //       },
  //       extraData: {
  //         activedMetricGroups,
  //         q,
  //         isSqlMode,
  //         time_field,
  //         customTime,
  //         dynamicFilterKey,
  //         dynamicFilterDataAPI,
  //       },
  //     };

  //     _aa-submitResult(_api, { loadData: createLoadDataFn({ api: _api, chartType }) });
  //   }
  // }, [isSqlMode, q, _submitResult, customTime, time_field, initialUrl, defaultMetric, activedMetricGroups, getTimeRange, dynamicFilterKey, dynamicFilterDataAPI, chartType]);

  // // 动态配置 api query，旧版拼接规则
  // useEffect(() => {
  //   const validMetrics = filter(activedMetrics, ({ metric, aggregation }) => metric && aggregation);
  //   if (isEmpty(fieldsMap) || isEmpty(validMetrics) || isEmpty(fieldInfo) || isV2Type) return;

  //   const filters = map(
  //     map(
  //       reduce(typeMap, (result, { filters: _filters }) => [...result, ...(_filters || [])], [] as MONITOR_COMMON_METADATA.Filter[]),
  //       ({ operation }) => operation
  //     ),
  //     (k) => getFilterMap(activedFilters, k)
  //   );
  //   // 多指标处理为指标切换
  //   const isMultiMetrics = validMetrics.length > 1;
  //   // const defaultValidMetric = [validMetrics[0]];
  //   const getAggregate = (_metrics: typeof validMetrics) => reduce(_metrics, (acc, { metric, aggregation, alias }) => {
  //     const metricVal = fieldsMap[metric].key;
  //     const metricName = fieldsMap[metric].name;
  //     // 筛选相同聚合方法
  //     const repeatValidMetrics = filter(_metrics, { aggregation });

  //     return {
  //       ...acc,
  //       [aggregation]: map(repeatValidMetrics, ({ metric: _metric }) => fieldsMap[_metric].key),
  //       [`alias_${aggregation}.${metricVal}`]: alias || `${metricName}${aggregationMap[aggregation].name}`,
  //     };
  //   }, {});

  //   // 分组别名
  //   const groupCN = reduce(activedGroup, (acc, group) => {
  //     return {
  //       ...acc,
  //       [`alias_last.${group}`]: find(fieldsMap, { key: group })?.name,
  //     };
  //   }, {});
  //   const result = {
  //     ...reduce(filters, (acc, item) => ({ ...acc, ...item }), {}),
  //     // 默认的 filters
  //     ...reduce(fieldInfo.filters, (acc, { tag, op, value }) => ({ ...acc, [`${op}_tag.${tag}`]: value }), {}),
  //     // 聚合
  //     ...(isMetricSelector && isMultiMetrics ? undefined : getAggregate(validMetrics)),
  //     ...groupCN,
  //     group: !isEmpty(activedGroup) ? `(${activedGroup.join(',')})` : undefined,
  //     limit,
  //     time_field,
  //     columns: isTableType && activedGroup
  //       ? `${map(validMetrics, ({ metric, aggregation }) => `${map(activedGroup, (group) => `last.${group}`).join(',')},${aggregation}.${fieldsMap[metric].key}`).join(',')}`
  //       : undefined,
  //     last: isTableType ? activedGroup : undefined,
  //     sort: isTableType ? `${validMetrics[0].aggregation}_${fieldsMap[validMetrics[0].metric].key}` : undefined,
  //     format: 'chartv2',
  //     ...getTimeRange(),
  //     filter__metric_scope: scope,
  //     filter__metric_scope_id: scopeId,
  //   };
  //   // 多指标转换成筛选项
  //   const metricSelector = {
  //     key: 'metric-selector',
  //     options: map(validMetrics, ({ metric, aggregation, alias }) => {
  //       const metricVal = fieldsMap[metric].key;
  //       const metricName = fieldsMap[metric].name;
  //       // 筛选相同聚合方法
  //       const repeatValidMetrics = filter(validMetrics, { aggregation });

  //       const _value = {
  //         [aggregation]: map(repeatValidMetrics, ({ metric: _metric }) => fieldsMap[_metric]?.key),
  //         [`alias_${aggregation}.${metricVal}`]: alias || `${metricName}${aggregationMap[aggregation]?.name}`,
  //       };

  //       return {
  //         value: JSON.stringify(_value),
  //         name: `${metricName}${aggregationMap[aggregation].name}`,
  //       };
  //     }),
  //     componentProps: {
  //       placeholder: '请选择指标',
  //     },
  //   };
  //   const _api = {
  //     url: initialUrl.replace(/{{metricName}}/g, fieldInfo.metric),
  //     method: 'GET',
  //     query: result,
  //     // 前端回填用的存储结构
  //     extraData: {
  //       activedMetricGroups,
  //       activedMetrics: validMetrics,
  //       filters: activedFilters,
  //       group: activedGroup,
  //       limit,
  //       timeFormat,
  //       dynamicFilterKey,
  //       dynamicFilterDataAPI,
  //       time_field,
  //       customTime,
  //       isMetricSelector,
  //       dataConfigSelectors: isMetricSelector ? [metricSelector] : undefined,
  //     },
  //   };

  //   // 旧的拼接方式
  //   _aa-submitResult(_api, {
  //     loadData: createLoadDataFn({ api: _api, chartType }),
  //     config: merge({}, currentChartConfig, { optionProps: { isMoreThanOneDay: !!timeFormat, moreThanOneDayFormat: timeFormat } }),
  //   });
  // }, [isMetricSelector, activedFilters, activedGroup, activedMetricGroups, limit, timeFormat, dynamicFilterKey, customTime, time_field, isLineType, initialUrl, activedMetrics, isTableType, activedMetricGroups, _submitResult, metaConstantMap.filters, aggregationMap, fieldsMap, fieldInfo]);


  // // 新版拼接规则
  // useEffect(() => {
  //   const validMetrics = addExtraPropertiesForMetrics(filter(activedMetrics, ({ metric, aggregation }) => metric && aggregation));
  //   // const validXAxis = addExtraPropertiesForMetrics(filter(xAxis as any[], ({ metric }) => metric));

  //   if (!isV2Type || isEmpty(validMetrics) || isEmpty(fieldInfo)) return;

  //   const _activedFilters = filter(activedFilters, ({ tag, value, method }) => tag && value && method);
  //   const _api = {
  //     url: loadDataUrl,
  //     method: 'POST',
  //     query: {
  //       format: 'chartv2',
  //       ql: 'influxql:ast',
  //       type: '_',
  //       time_field,
  //       ...getTimeRange(),
  //       filter__metric_scope: scope,
  //       filter__metric_scope_id: scopeId,
  //     },
  //     body: {
  //       select: getIndicatorExpressions(
  //         map([...validXAxis, ...validMetrics], ({ fid, ...rest }) => ({
  //           ...rest,
  //           alias: fid,
  //         }))
  //       ),
  //       where: getFilterExpressions(_activedFilters),
  //       from: [fieldInfo.metric],
  //       groupby: isMapType
  //         // 地图下钻产生的值 => 需要获取图表信息
  //         ? [mapLevel]
  //         :
  //         (isEmpty(activedGroup) && isEmpty(validXAxis))
  //           ? undefined
  //           : [
  //             ...activedGroup,
  //             ...map(validXAxis, ({ metric }) => fieldsMap[metric]?.key),
  //           ],
  //       limit: 100,
  //     },
  //     // 前端回填用的存储结构
  //     extraData: {
  //       activedMetricGroups,
  //       activedMetrics: validMetrics,
  //       // xAxis: validXAxis,
  //       filters: activedFilters,
  //       group: activedGroup,
  //       limit,
  //       dynamicFilterKey,
  //       dynamicFilterDataAPI,
  //       time_field,
  //       customTime,
  //     },
  //   };

  //   // 新版数据请求
  //   _aa-submitResult(_api, { loadData: createLoadDataFn({ api: _api, chartType }) });
  // }, [activedFilters, time_field, customTime, activedMetrics, fieldInfo, aggregationMap, activedGroup, activedMetricGroups, mapLevel]);

  const getDSLSelects = useCallback((dimensions: DICE_DATA_CONFIGURATOR.Dimension[]) => (isEmpty(dimensions)
    ? undefined
    : [
      ...map(dimensions, ({ type, field, aggregation, key, expr: _expr }) => {
        let expr;
        switch (type) {
          case 'expr':
            expr = _expr;
            break;
          case 'time':
            expr = 'time';
            break;
          case 'field':
            expr = aggregation ? `${aggregation}(${fieldsMap[field as string]?.key})` : fieldsMap[field as string]?.key;
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
        : map(dimensions, ({ type, field, expr }) => {
          let val;
          switch (type) {
            case 'time':
              val = 'time';
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

  const getLoadData = useCallback((payload: Omit<ICreateLoadDataFn, 'chartType'>) => {
    return createLoadDataFn({
      ...payload,
      chartType,
    } as any);
  }, [chartType]);

  const genApi = useCallback(({
    activedMetricGroups,
    typeDimensions,
    valueDimensions,
  }: DC.DatasourceConfig): DC.API => {
    return {
      url: loadDataUrl,
      method: 'post',
      query: {
        format: 'chartv2',
        ql: 'influxql:ast',
        // q,
        type: '_',
        time_field: find(typeDimensions, { type: 'time' })?.timeField,
        ...getTimeRange(),
        filter__metric_scope: scope,
        filter__metric_scope_id: scopeId,
      },
      body: {
        from: isEmpty(activedMetricGroups) ? undefined : [activedMetricGroups[activedMetricGroups.length - 1].split('@').pop()],
        select: getDSLSelects([...(typeDimensions || []), ...(valueDimensions || [])]),
        // where: getFilterExpressions(_activedFilters),
        groupby: getDSLGroupBy(typeDimensions as DICE_DATA_CONFIGURATOR.Dimension[]),
        // 0个维度且有1个或多个多个值，limit为1，返回最新值
        limit: ((typeDimensions || []).length < 1 && (valueDimensions || []).length > 0) ? 1 : undefined,
      },
    };
  }, [getDSLGroupBy, getDSLSelects, getTimeRange, scope, scopeId]);

  const handleUpdateDataSource = useCallback((_dataSource: Partial<DC.DatasourceConfig>) => {
    const newDataSource = produce(dataSource, (draft) => {
      forEach(_dataSource, (v, k) => { draft[k] = v; });
    });

    const _api = genApi(newDataSource);
    _submitResult({
      config: produce(currentChartConfig, (draft) => { draft.dataSourceConfig = newDataSource; }),
      api: _api,
      loadData: getLoadData({ api: _api, ...newDataSource }),
    });
  }, [_submitResult, dataSource, currentChartConfig, genApi, getLoadData]);

  const fieldsList = [
    {
      label: textMap['configuration mode'],
      type: Switch,
      name: 'isSqlMode',
      required: false,
      show: () => isTableType,
      customProps: {
        defaultChecked: dataSource?.isSqlMode,
        checkedChildren: 'SQL',
        unCheckedChildren: textMap.dsl,
        onChange: (checked: boolean) => handleUpdateDataSource({ isSqlMode: checked }),
      },
    },
    {
      label: textMap['metrics group'],
      type: Cascader,
      name: 'activedMetricGroups',
      initialValue: dataSource?.activedMetricGroups,
      customProps: {
        allowClear: false,
        showSearch: true,
        options: metaGroups,
        onChange: (v: string[]) => {
          handleUpdateDataSource({ activedMetricGroups: v });
          !dataSource?.isSqlMode && handleGetMetaData(v);
        },
      },
    },
    {
      label: 'SQL',
      name: 'sql',
      type: TextArea,
      initialValue: dataSource?.q,
      show: () => isTableType && dataSource.isSqlMode,
      customProps: {
        rows: 10,
        onChange: (e: React.FocusEvent<HTMLInputElement>) => {
          handleUpdateDataSource({ q: e.target.value });
        },
      },
    },
    {
      label: textMap.dimensions,
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
