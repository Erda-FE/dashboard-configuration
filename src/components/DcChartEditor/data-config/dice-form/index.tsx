/* 数据源配置器
 * @Author: licao
 * @Date: 2020-12-23 19:36:48
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-27 19:10:08
 */
import React, { useMemo, useCallback, useRef } from 'react';
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

  const getDSLFilters = useCallback((dimensions: DICE_DATA_CONFIGURATOR.Dimension[]) => {
    if (isEmpty(dimensions)) return;
    return map(dimensions, ({ type, field, filter, expr }) => {
      if (type === 'filter') {
        return `${fieldsMap[field as string]?.key}${filter?.operation}${isNumber(filter?.value) ? filter?.value : `'${filter?.value}'`}`;
      } else if (type === 'expr') {
        return expr;
      }
      return '';
    });
  }, [fieldsMap]);

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
    resultFilters,
    isSqlMode,
    q,
  }: DC.DatasourceConfig): DC.API => {
    return {
      url: loadDataUrl,
      method: 'post',
      query: {
        format: 'chartv2',
        ql: isSqlMode ? 'influxql' : 'influxql:ast',
        type: '_',
        time_field: find(typeDimensions, { type: 'time' })?.timeField,
        ...getTimeRange(),
        filter__metric_scope: scope,
        filter__metric_scope_id: scopeId,
      },
      body: {
        from: isEmpty(activedMetricGroups) ? undefined : [activedMetricGroups[activedMetricGroups.length - 1].split('@').pop()],
        select: getDSLSelects([...(typeDimensions || []), ...(valueDimensions || [])]),
        where: getDSLFilters(resultFilters as DICE_DATA_CONFIGURATOR.Dimension[]),
        groupby: getDSLGroupBy(typeDimensions as DICE_DATA_CONFIGURATOR.Dimension[]),
        // 0个维度且有1个或多个多个值，limit为1，返回最新值
        limit: ((typeDimensions || []).length < 1 && (valueDimensions || []).length > 0) && !isMapType ? 1 : undefined,
      },
    };
  }, [getDSLFilters, getDSLGroupBy, getDSLSelects, getTimeRange, isMapType, scope, scopeId]);

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
