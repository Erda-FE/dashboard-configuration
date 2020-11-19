import React, { useEffect, useMemo, useCallback } from 'react';
import { map, uniqueId, remove, find, findIndex, reduce, filter, isEmpty, keyBy, debounce, isNumber, merge } from 'lodash';
import { useMount } from 'react-use';
import { parse } from 'query-string';
import { Button, Table, Select, Input, Tooltip, Switch, InputNumber } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { RenderPureForm, useUpdate, IF } from '../common';
import dataConfigMetaDataStore from '../stores/data-config-metadata';
import customDashboardStore from '../stores/custom-dashboard';
import { insertWhen } from '../common/utils';
import { CUSTOM_TIME_RANGE_MAP, MAP_LEVEL, MAP_ALIAS, TIME_FORMATS } from '../constants';
import DynamicFilterDataModal from './dynamic-filter-data-modal';
import { createLoadDataFn } from './data-loader';

import './monitor-metrics-form.scss';

interface IProps {
  currentChart: {
    chartType: string;
    api?: any;
    curMapType?: string[];
    config?: object;
  };
  form: WrappedFormUtils;
  submitResult: (result: any, extraOption?: any) => void;
}

export default ({ submitResult, currentChart, form }: IProps) => {
  const { scope = 'bigData', scopeId = 'default' } = parse(window.location.search);
  const [
    metaGroups,
    metaConstantMap,
    metaMetrics,
  ] = dataConfigMetaDataStore.useStore((s) => [
    s.metaGroups,
    s.metaConstantMap,
    s.metaMetrics,
  ]);
  const timeSpan = customDashboardStore.useStore((s) => s.timeSpan);
  // 展开所有分类指标，给大盘配置用
  const fieldsMap = useMemo(() => reduce(metaMetrics, (result, value) => {
    const { fields, tags, metric, filters } = value;
    const singleFieldsMap = reduce(fields, (acc, field) => ({ ...acc, [`${metric}-${field.key}`]: { ...field, tags, metric, filters } }), {});
    return { ...result, ...singleFieldsMap };
  }, {}), [metaMetrics]);
  const defaultMetric = useMemo(() => metaMetrics[0] || {}, [metaMetrics]);
  const { types: typeMap } = metaConstantMap;
  const aggregationMap = useMemo(() => reduce(typeMap, (result, { aggregations }) => ({ ...result, ...keyBy(aggregations, 'aggregation') }), {}), [typeMap]);

  const { getMetaGroups, getMetaData } = dataConfigMetaDataStore.effects;
  const { chartType, api, curMapType = [], config: currentChartConfig = {} } = currentChart;

  const [mapLevel, preLevel] = useMemo(() => [MAP_LEVEL[curMapType.length - 1], MAP_LEVEL[curMapType.length - 2]], [currentChart.curMapType]);
  const apiExtraData = api.extraData;
  const isLineType = ['chart:line', 'chart:bar', 'chart:area'].includes(chartType);
  const isTableType = chartType === 'table';
  const isMapType = chartType === 'chart:map';
  // 请求数据接口
  const initialUrl = isLineType ? '/api/metrics/{{metricName}}/histogram' : '/api/metrics/{{metricName}}';
  // 新增的散点图、地图采用新的拼接规则和返回结构
  const isV2Type = ['chart:map', 'chart:scatter'].includes(chartType);
  const v2SubmitUrl = '/api/query';

  const [{
    activedMetricGroups,
    activedMetrics,
    activedFilters,
    activedGroup,
    time_field,
    customTime,
    limit,
    timeFormat,
    dynamicFilterKey,
    dynamicFilterDataAPI,
    dynamicFilterDataModalVisible,
    q,
    isSqlMode,
  }, updater, update] = useUpdate({
    activedMetricGroups: apiExtraData ? apiExtraData.activedMetricGroups : [],
    activedMetrics: apiExtraData ?
      [
        ...(apiExtraData.activedMetrics || []),
        ...insertWhen(
          apiExtraData.metric && apiExtraData.aggregation,
          [{ key: uniqueId(), metric: apiExtraData.metric, aggregation: apiExtraData.aggregation }]
        ),
      ]
      : [],
    activedFilters: apiExtraData ? apiExtraData.filters : [],
    activedGroup: apiExtraData ? apiExtraData.group : [],
    time_field: apiExtraData ? apiExtraData.time_field : undefined,
    customTime: apiExtraData ? apiExtraData.customTime : undefined,
    limit: apiExtraData ? apiExtraData.limit : undefined,
    timeFormat: apiExtraData ? apiExtraData.timeFormat : undefined,
    dynamicFilterKey: apiExtraData ? apiExtraData.dynamicFilterKey : undefined,
    dynamicFilterDataAPI: apiExtraData ? apiExtraData.dynamicFilterDataAPI : {},
    dynamicFilterDataModalVisible: false,
    q: apiExtraData ? apiExtraData.q : undefined,
    isSqlMode: apiExtraData ? apiExtraData.isSqlMode : false,
  });

  const fieldInfo = fieldsMap[(activedMetrics[0] || {}).metric] || {};

  useMount(() => {
    // 新的元数据接口加 version=v2
    getMetaGroups({ scope, scopeId, version: isV2Type ? 'v2' : undefined });
    !isEmpty(activedMetricGroups) && getMetaData({
      scope,
      scopeId,
      groupId: activedMetricGroups[activedMetricGroups.length - 1],
      version: isV2Type ? 'v2' : undefined,
    });
  });

  const resetState = useCallback((_metric) => {
    update({
      activedMetrics: [],
      activedFilters: [],
      activedGroup: [],
      limit: undefined,
      timeFormat: undefined,
      dynamicFilterKey: undefined,
      customTime: undefined,
      time_field: undefined,
      q: _metric.sql,
    });
  }, [update]);

  const _submitResult = useCallback(debounce(submitResult, 500), []);

  const getFilterMap = (data: any, key: string) => {
    return reduce(
      // 过滤值全的筛选项
      filter(data, ({ tag, value, method }) => tag && value && method && (method === key)),
      (result, { tag, value }) => ({
        ...result,
        [`${key}_${tag}`]: key === 'in' ? value.split(',') : value,
      }), {}
    );
  };

  // 表达式拼接规则：https://yuque.antfin-inc.com/docs/share/f9069b1a-5110-4954-b427-9bed97afd593#WmfAm
  const getFilterExpressions = (_filters: any[]) => {
    let filterExpressions = map(_filters, ({ tag, method, value }) => `${tag}${method}${isNumber(value) ? value : `\'${value}\'`}`);
    filterExpressions = [
      ...filterExpressions,
      ...insertWhen(isMapType && !!preLevel, [`${preLevel}=\'${curMapType[curMapType.length - 1]}\'`]),
    ];
    return isEmpty(filterExpressions) ? undefined : filterExpressions;
  };
  const getIndicatorExpressions = (_indicators: any) => [
    ...map(_indicators, ({ metric, aggregation, alias }) => ({
      expr: `${aggregation}(${fieldsMap[metric].key})`,
      alias,
    })),
    ...insertWhen(isMapType, [
      { expr: `${mapLevel}::tag`, alias: MAP_ALIAS },
    ]),
  ];

  const getTimeRange = useCallback(() => {
    if (customTime) {
      const [start, end] = CUSTOM_TIME_RANGE_MAP[customTime].getTimeRange();
      return { start, end };
    }
    return {
      start: timeSpan.startTimeMs,
      end: timeSpan.endTimeMs,
    };
  }, [timeSpan, customTime]);

  // Sql 模式只在表格图中出现
  useEffect(() => {
    if (isSqlMode) {
      if (!q) return;

      const api = {
        url: initialUrl.replace(/{{metricName}}/g, defaultMetric.metric),
        method: 'GET',
        query: {
          q,
          ...reduce(defaultMetric.filters, (acc, { tag, op, value }) => ({ ...acc, [`${op}_tag.${tag}`]: value }), {}),
          format: 'chartv2',
          time_field,
          ...getTimeRange(),
          filter__metric_scope: scope,
          filter__metric_scope_id: scopeId,
        },
        extraData: {
          activedMetricGroups,
          q,
          isSqlMode,
          time_field,
          customTime,
          dynamicFilterKey,
          dynamicFilterDataAPI,
        },
      };

      _submitResult(api, { loadData: createLoadDataFn({ api, chartType }) });
    }
  }, [isSqlMode, q, _submitResult, customTime, time_field, initialUrl, defaultMetric, timeSpan, activedMetricGroups]);

  // 动态配置 api query，旧版拼接规则
  useEffect(() => {
    const validMetrics = filter(activedMetrics, ({ metric, aggregation }) => metric && aggregation);
    if (isEmpty(fieldsMap) || isEmpty(validMetrics) || isEmpty(fieldInfo) || isV2Type) return;

    const filters = map(
      map(
        reduce(typeMap, (result, { filters }) => [...result, ...(filters || [])], [] as MONITOR_COMMON_METADATA.Filter[]),
        ({ operation }) => operation
      ),
      (k) => getFilterMap(activedFilters, k)
    );
    // 多指标处理为指标切换
    const isMetricSelector = validMetrics.length > 1;
    const aggregate = reduce(validMetrics, (acc, { metric, aggregation }) => {
      const metricVal = fieldsMap[metric].key;
      const metricName = fieldsMap[metric].name;
      // 筛选相同聚合方法
      const repeatValidMetrics = filter(validMetrics, { aggregation });

      return {
        ...acc,
        [aggregation]: map(repeatValidMetrics, ({ metric: _metric }) => fieldsMap[_metric].key),
        [`alias_${aggregation}.${metricVal}`]: `${metricName}${aggregationMap[aggregation].name}`,
      };
    }, {});

    const groupCN = reduce(activedGroup, (acc, group) => {
      return {
        ...acc,
        [`alias_last.${group}`]: (find(fieldsMap, { key: group }) || {}).name,
      };
    }, {});
    const result = {
      ...reduce(filters, (acc, item) => ({ ...acc, ...item }), {}),
      // 默认的 filters
      ...reduce(fieldInfo.filters, (acc, { tag, op, value }) => ({ ...acc, [`${op}_tag.${tag}`]: value }), {}),
      ...(isMetricSelector ? {} : aggregate),
      ...groupCN,
      group: !isEmpty(activedGroup) ? `(${activedGroup.join(',')})` : undefined,
      limit,
      time_field,
      columns: isTableType && activedGroup
        ? `${map(validMetrics, ({ metric, aggregation }) => `${map(activedGroup, (group) => `last.${group}`).join(',')},${aggregation}.${fieldsMap[metric].key}`).join(',')}`
        : undefined,
      last: isTableType ? activedGroup : undefined,
      sort: isTableType ? `${validMetrics[0].aggregation}_${fieldsMap[validMetrics[0].metric].key}` : undefined,
      format: 'chartv2',
      ...getTimeRange(),
      filter__metric_scope: scope,
      filter__metric_scope_id: scopeId,
    };
    // 多指标转换成筛选项
    const metricSelector = {
      key: 'metric-selector',
      options: map(validMetrics, ({ metric, aggregation }) => {
        const metricVal = fieldsMap[metric].key;
        const metricName = fieldsMap[metric].name;
        // 筛选相同聚合方法
        const repeatValidMetrics = filter(validMetrics, { aggregation });

        const _value = {
          [aggregation]: map(repeatValidMetrics, ({ metric: _metric }) => fieldsMap[_metric].key),
          [`alias_${aggregation}.${metricVal}`]: `${metricName}${aggregationMap[aggregation].name}`,
        };

        return {
          value: JSON.stringify(_value),
          name: `${metricName}${aggregationMap[aggregation].name}`,
        };
      }),
      componentProps: {
        placeholder: '请选择指标',
      },
    };
    const api = {
      url: initialUrl.replace(/{{metricName}}/g, fieldInfo.metric),
      method: 'GET',
      query: result,
      // 前端回填用的存储结构
      extraData: {
        activedMetricGroups,
        activedMetrics: validMetrics,
        filters: activedFilters,
        group: activedGroup,
        limit,
        timeFormat,
        dynamicFilterKey,
        dynamicFilterDataAPI,
        time_field,
        customTime,
        dataConfigSelectors: isMetricSelector ? [metricSelector] : undefined,
      },
    };

    // 旧的拼接方式
    _submitResult(api, {
      loadData: createLoadDataFn({ api, chartType }),
      config: merge({}, currentChartConfig, { optionProps: { isMoreThanOneDay: !!timeFormat, moreThanOneDayFormat: timeFormat } }),
    });
  }, [activedFilters, activedGroup, activedMetricGroups, limit, timeFormat, dynamicFilterKey, customTime, time_field, isLineType, initialUrl, activedMetrics, isTableType, activedMetricGroups, _submitResult, metaConstantMap.filters, aggregationMap, fieldsMap, fieldInfo]);

  // 新版拼接规则
  useEffect(() => {
    const validMetrics = filter(activedMetrics, ({ metric, aggregation }) => metric && aggregation);
    if (!isV2Type || isEmpty(validMetrics) || isEmpty(fieldInfo)) return;

    const _activedFilters = filter(activedFilters, ({ tag, value, method }) => tag && value && method);
    const _api = {
      url: v2SubmitUrl,
      method: 'POST',
      query: {
        format: 'chartv2',
        ql: 'influxql:ast',
        type: '_',
        time_field,
        ...getTimeRange(),
        filter__metric_scope: scope,
        filter__metric_scope_id: scopeId,
      },
      body: {
        select: getIndicatorExpressions(
          map(validMetrics, (metric) => ({
            ...metric,
            alias: `${fieldsMap[metric.metric].name}${aggregationMap[metric.aggregation].name}`,
          }))
        ),
        where: getFilterExpressions(_activedFilters),
        from: [fieldInfo.metric],
        groupby: isMapType
          // 地图下钻产生的值 => 需要获取图表信息
          ? [mapLevel]
          : isEmpty(activedGroup)
            ? undefined : activedGroup,
        limit: 100,
      },
      // 前端回填用的存储结构
      extraData: {
        activedMetricGroups,
        activedMetrics: validMetrics,
        filters: activedFilters,
        group: activedGroup,
        limit,
        dynamicFilterKey,
        dynamicFilterDataAPI,
        time_field,
        customTime,
      },
    };

    // 新版数据请求
    _submitResult(_api, { loadData: createLoadDataFn({ api: _api, chartType }) });
  }, [activedFilters, time_field, customTime, activedMetrics, fieldInfo, aggregationMap, activedGroup, activedMetricGroups, mapLevel]);

  const deleteColumn = (cols: any, colKey: any) => {
    const _cols = [...cols];
    remove(_cols, { key: colKey });
    return _cols;
  };

  const updateColumn = (cols: Array<{ key: string; value: any; tag: any }>, colKey: string, properties: Array<{ property: string; value: any }>) => {
    const _cols = [...cols];
    const idx = findIndex(_cols, { key: colKey });
    const newColumn = {
      ...find(_cols, { key: colKey }),
      ...reduce(properties, (acc, { property, value }) => ({ ...acc, [property]: value }), {}),
    } as any;
    _cols.splice(idx, 1, newColumn);
    return _cols;
  };

  const filterColumns = useMemo(() => [
    {
      title: '标签',
      width: 120,
      dataIndex: 'tag',
      render: (value: string, { key }: any) => (
        <Select
          showSearch
          defaultValue={value}
          onSelect={(v: any) => {
            update({
              activedFilters: updateColumn(activedFilters, key, [
                { property: 'tag', value: v },
                { property: 'method', value: undefined },
                { property: 'value', value: undefined },
              ]),
            });
          }}
        >
          {map(fieldsMap, ({ key, name }) => <Select.Option key={key}><Tooltip title={name}>{name}</Tooltip></Select.Option>)}
        </Select>
      ),
    },
    {
      title: '方法',
      width: 100,
      dataIndex: 'method',
      render: (value: string, { key, tag }: any) => (
        <Select
          showSearch
          value={value}
          onSelect={(v: any) => update({
            activedFilters: updateColumn(
              activedFilters,
              key,
              [{ property: 'method', value: v }]
            ),
          })}
        >
          {map(
            (typeMap[(find(fieldsMap as any, { key: tag }) || {}).type] || {}).filters,
            ({ operation, name }) => <Select.Option key={operation}>{name}</Select.Option>
          )}
        </Select>
      ),
    },
    {
      title: '预期值',
      width: 100,
      dataIndex: 'value',
      render: (value: any, { key, tag }: any) => {
        const _type = (find(fieldsMap as any, { key: tag }) || {}).type;
        const _handleChange = (_val?: string | number) => update({
          activedFilters: updateColumn(
            activedFilters,
            key,
            [{ property: 'value', value: _val }]
          ),
        });

        let expectedValEle = (
          <Input
            value={value}
            onChange={(e) => _handleChange(e.target.value)}
          />
        );

        if (_type === 'number') {
          expectedValEle = <InputNumber value={value} onChange={_handleChange} />;
        }

        // 支持下拉多选
        // const selectedFilter = find(activedFilters, { key }) || {} as any;
        // const { values } = find(fieldInfo.tags, { key: (selectedFilter.tag || '').split('.')[1] }) || {} as any;
        // if (!isEmpty(values)) {
        //   expectedValEle = (
        //     <Select
        //       showSearch
        //       value={value}
        //       onSelect={(v: any) => {
        //         update({
        //           activedFilters: updateColumn(activedFilters, key, [{ property: 'value', value: v }]),
        //         });
        //       }}
        //     >
        //       {map(values, ({ value: v, name }) => <Select.Option key={v} value={v}>{name}</Select.Option>)}
        //     </Select>
        //   );
        // }

        return expectedValEle;
      },
    },
    {
      title: '操作',
      fixed: 'right',
      width: 70,
      render: ({ key }: any) => {
        return (
          <div className="table-operations">
            <span className="table-operations-btn" onClick={() => { update({ activedFilters: deleteColumn(activedFilters, key) }); }}>
              删除
            </span>
          </div>
        );
      },
    },
  ], [activedFilters, fieldInfo.tags, fieldsMap, typeMap, update]);

  const aggregateColumns = useMemo(() => [
    {
      title: '指标',
      dataIndex: 'metric',
      render: (value: string, { key }: any) => (
        <Select
          showSearch
          defaultValue={value}
          onSelect={(v: any) => update({ activedMetrics: updateColumn(activedMetrics, key, [
            { property: 'metric', value: v },
            { property: 'aggregation', value: undefined },
          ]) })}
        >
          {map(fieldsMap, (v: any, k) => <Select.Option key={k} value={k}><Tooltip title={v.name}>{v.name}</Tooltip></Select.Option>)}
        </Select>
      ),
    },
    {
      title: '方法',
      dataIndex: 'aggregation',
      render: (value: string, { key, metric }: any) => (
        <Select
          showSearch
          value={value}
          onSelect={(v: any) => update({ activedMetrics: updateColumn(activedMetrics, key, [
            { property: 'aggregation', value: v },
          ]) })}
        >
          {map(((typeMap[(fieldsMap[metric] || {}).type] || {}) || {}).aggregations, (v) => <Select.Option key={v.aggregation} value={v.aggregation}>{v.name}</Select.Option>)}
        </Select>
      ),
    },
    {
      title: '操作',
      width: 70,
      render: ({ key }: any) => {
        return (
          <div className="table-operations">
            <span
              className="table-operations-btn"
              onClick={() => update({ activedMetrics: deleteColumn(activedMetrics, key) })}
            >
              删除
            </span>
          </div>
        );
      },
    },
  ], [activedMetrics, fieldsMap, typeMap, isSqlMode, update]);

  const fieldsList = useMemo(() => ([
    {
      label: '指标分组',
      type: 'cascader',
      required: true,
      options: metaGroups,
      itemProps: {
        defaultValue: activedMetricGroups,
        showSearch: true,
        placeholder: '请选择指标分组',
        onChange: (v: any) => {
          update({ activedMetricGroups: v });
          getMetaData({
            scope,
            scopeId,
            groupId: v[v.length - 1],
            version: isV2Type ? 'v2' : undefined,
          }).then(resetState);
        },
      },
    },
    ...insertWhen(isSqlMode, [{
      label: 'SQL',
      type: 'textArea',
      required: true,
      itemProps: {
        value: q,
        rows: 10,
        onChange: (e: any) => {
          updater.q(e.target.value);
        },
      },
    }]),
    // 配置多聚合后自动生成聚合筛选框
    ...insertWhen(!isSqlMode, [{
      label: '聚合',
      required: true,
      getComp: () => (
        <>
          <Button
            className="mb8"
            icon="plus"
            onClick={() => {
              update({ activedMetrics: [
                { key: uniqueId(), metric: undefined, aggregation: undefined },
                ...activedMetrics,
              ] });
            }}
          >
            添加
          </Button>
          <Table
            bordered
            rowKey="key"
            dataSource={activedMetrics}
            columns={aggregateColumns}
            pagination={{ pageSize: 5, hideOnSinglePage: true }}
          />
        </>
      ),
    },
    {
      label: '过滤',
      required: false,
      getComp: () => (
        <>
          <Button
            className="mb8"
            icon="plus"
            onClick={() => {
              update({ activedFilters: [
                ...activedFilters,
                { key: uniqueId(), tag: undefined, value: undefined, method: undefined },
              ] });
            }}
          >
            添加
          </Button>
          <Table
            rowKey="key"
            dataSource={activedFilters}
            columns={filterColumns}
            scroll={{ x: 450 }}
            pagination={{ pageSize: 5, hideOnSinglePage: true }}
          />
        </>
      ),
    },
    ...insertWhen(!isMapType, [{
      label: '分组',
      required: false,
      type: 'select',
      options: map(filter(fieldsMap, { type: 'string' }), ({ key, name }) => ({ name, value: key })),
      itemProps: {
        type: 'select',
        placeholder: '请选择分组',
        mode: 'multiple',
        defaultValue: activedGroup,
        onChange: (v: any) => update({ activedGroup: v }),
      },
    }]),
    {
      label: '动态过滤',
      required: false,
      getComp: () => (
        <div className="flex-box">
          <Select
            className="inline-sub-item"
            showSearch
            allowClear
            placeholder="选择过滤字段"
            defaultValue={dynamicFilterKey}
            onSelect={(v: any) => update({ dynamicFilterKey: v })}
          >
            {map(fieldsMap, (v: any, k) => <Select.Option key={k} value={k}><Tooltip title={v.name}>{v.name}</Tooltip></Select.Option>)}
          </Select>
          <Button disabled={!dynamicFilterKey} onClick={() => update({ dynamicFilterDataModalVisible: true })}>数据源</Button>
        </div>
      ),
    },
    ...insertWhen(isLineType, [{
      label: 'X轴时间格式',
      required: false,
      type: 'select',
      options: TIME_FORMATS,
      itemProps: {
        type: 'select',
        allowClear: true,
        placeholder: '可指定时间轴显示格式',
        defaultValue: timeFormat,
        onChange: (v: any) => update({ timeFormat: v }),
      },
    }]),
    ...insertWhen(isTableType, [{
      label: 'TopN',
      required: false,
      type: 'inputNumber',
      itemProps: {
        min: 0,
        max: 100,
        precision: 0,
        defaultValue: limit,
        onChange: (v: any) => update({ limit: v }),
      },
    }])]),
    {
      label: '自定义时间字段',
      required: false,
      type: 'select',
      options: map(filter(fieldsMap, { type: 'number' }), ({ key, name }) => ({ name, value: key })),
      itemProps: {
        allowClear: true,
        placeholder: '可选择字段指定为时间字段',
        defaultValue: time_field,
        onChange: (v: any) => update({ time_field: v }),
      },
    },
    {
      label: '固定时间范围',
      required: false,
      type: 'select',
      options: map(CUSTOM_TIME_RANGE_MAP, ({ name }, value) => ({ value, name })),
      itemProps: {
        allowClear: true,
        placeholder: '可选择固定时间来筛选',
        defaultValue: customTime,
        onChange: (v: any) => update({ customTime: v }),
      },
    },
  ]), [metaGroups, activedMetricGroups, q, activedGroup, isTableType, update, getMetaData, resetState, activedMetrics, aggregateColumns, activedFilters, filterColumns, limit, timeFormat, dynamicFilterKey, dynamicFilterDataModalVisible, time_field, customTime]);

  return (
    <div className="monitor-metrics-form">
      <IF check={isTableType}>
        <div className="text-right mb16">
          <Switch
            checkedChildren="SQL"
            unCheckedChildren="表单"
            checked={isSqlMode}
            onChange={(checked) => updater.isSqlMode(checked)}
          />
        </div>
      </IF>
      <RenderPureForm form={form} layout="vertical" list={fieldsList} />
      <DynamicFilterDataModal
        title="动态过滤数据源配置"
        visible={dynamicFilterDataModalVisible}
        isV2Type={isV2Type}
        defaultValue={(dynamicFilterDataAPI || {}).extraData}
        onCancel={() => update({ dynamicFilterDataModalVisible: false })}
        getTimeRange={getTimeRange}
        onOk={(dynamicFilterDataAPI) => { update({ dynamicFilterDataAPI }); }}
      />
    </div>
  );
};
