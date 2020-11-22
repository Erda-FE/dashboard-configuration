import React, { useMemo, useEffect, useCallback } from 'react';
import { Modal, Button, Table, Select, Tooltip, Input, InputNumber, message } from 'antd';
import { uniqueId, findIndex, find, reduce, map, remove, isEmpty, isNumber } from 'lodash';
import { RenderPureForm, useUpdate } from '../../../../common';
import { getConfig } from '../../../../config';

const { dynamicFilterMetaDataStore, scope, scopeId } = getConfig('diceDataConfigProps');

interface IProps {
  visible: boolean;
  title: string;
  defaultValue: any;
  getTimeRange: () => { start: number; end: number };
  onOk: (dynamicFilterDataAPI: any) => void;
  onCancel: () => void;
  [k: string]: any;
}

export default ({ visible, title, onOk, onCancel, getTimeRange, defaultValue, ...rest }: IProps) => {
  const { getMetaGroups, getMetaData } = dynamicFilterMetaDataStore.effects;
  const [
    metaGroups,
    metaMetrics,
    metaConstantMap,
  ] = dynamicFilterMetaDataStore.useStore((s: any) => [
    s.metaGroups,
    s.metaMetrics,
    s.metaConstantMap,
  ]);
  const initialState = {
    activedMetricGroups: defaultValue ? defaultValue.activedMetricGroups : [],
    activedMetric: defaultValue ? defaultValue.activedMetric : undefined,
    activedFilters: defaultValue ? defaultValue.activedFilters : [],
  };
  const [{
    activedMetricGroups,
    activedMetric,
    activedFilters,
  }, updater, update] = useUpdate(initialState);

  useEffect(() => {
    if (visible) {
      getMetaGroups({ scope, scopeId, version: 'v2' });
      activedMetricGroups && getMetaData({
        scope,
        scopeId,
        groupId: activedMetricGroups[activedMetricGroups.length - 1],
        version: 'v2',
      });
    }
  }, [visible, activedMetricGroups, getMetaGroups, getMetaData]);

  const typeMap = useMemo(() => metaConstantMap.types, [metaConstantMap]);
  const fieldsMap = useMemo(() => reduce(metaMetrics, (result, value) => {
    const { fields, tags, metric, filters } = value;
    const singleFieldsMap = reduce(fields, (acc, field) => ({ ...acc, [`${metric}-${field.key}`]: { ...field, tags, metric, filters } }), {});
    return { ...result, ...singleFieldsMap };
  }, {}), [metaMetrics]);
  const fieldInfo = useMemo(() => (activedMetric ? fieldsMap[activedMetric!] || {} : {}), [activedMetric]);
  const getFilterExpressions = (_filters: any[]) => {
    const filterExpressions = map(_filters, ({ tag, method, value }) => `${tag}${method}${isNumber(value) ? value : `'${value}'`}`);
    return isEmpty(filterExpressions) ? undefined : filterExpressions;
  };

  const resetState = () => {
    updater.activedMetric(undefined);
    updater.activedFilters([]);
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

  const deleteColumn = (cols: any, colKey: any) => {
    const _cols = [...cols];
    remove(_cols, { key: colKey });
    return _cols;
  };

  const handleCancel = () => {
    update(initialState);
    onCancel();
  };

  const handleGetData = useCallback(() => {
    if (!activedMetric || isEmpty(activedMetricGroups)) {
      message.warning('指标分组和值列表必填！');
      return;
    }
    const { key, name } = fieldsMap[activedMetric!];
    onOk({
      url: '/api/query',
      method: 'POST',
      query: {
        format: 'chartv2',
        ql: 'influxql:ast',
        type: '_',
        ...getTimeRange(),
        filter__metric_scope: scope,
        filter__metric_scope_id: scopeId,
      },
      body: {
        select: [
          {
            expr: key,
            alias: name,
          },
        ],
        where: getFilterExpressions(activedFilters),
        from: [fieldInfo.metric],
        groupby: [key],
        limit: 100,
      },
      extraData: {
        activedMetricGroups,
        activedMetric,
        activedFilters,
      },
    });
    handleCancel();
  }, [getTimeRange, activedFilters, activedMetric, activedMetricGroups]);

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
            updater.activedFilters(updateColumn(activedFilters, key, [
              { property: 'tag', value: v },
              { property: 'method', value: undefined },
              { property: 'value', value: undefined },
            ]));
          }}
        >
          {map(fieldsMap, ({ key: _key, name }) => <Select.Option key={_key}><Tooltip title={name}>{name}</Tooltip></Select.Option>)}
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
          onSelect={(v: any) => updater.activedFilters(updateColumn(
            activedFilters,
            key,
            [{ property: 'method', value: v }]
          ))}
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
        const _handleChange = (_val?: string | number) => updater.activedFilters(updateColumn(
          activedFilters,
          key,
          [{ property: 'value', value: _val }]
        ));
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
      render: ({ key }: any) => {
        return (
          <div className="table-operations">
            <span
              className="table-operations-btn"
              onClick={() => updater.activedFilters(deleteColumn(activedFilters, key))}
            >
              删除
            </span>
          </div>
        );
      },
    },
  ], [activedFilters, fieldsMap, typeMap, updater]);

  const fieldsList = useMemo(() => [
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
          updater.activedMetricGroups(v);
          getMetaData({
            scope,
            scopeId,
            groupId: v[v.length - 1],
            version: 'v2',
          }).then(resetState);
        },
      },
    },
    {
      label: '值列表',
      type: 'select',
      required: true,
      options: map(fieldsMap, (v: any, k) => ({ value: k, name: v.name })),
      itemProps: {
        value: activedMetric,
        showSearch: true,
        placeholder: '请选择指标',
        onChange: (v: any) => updater.activedMetric(v),
      },
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
              updater.activedFilters([
                ...activedFilters,
                {
                  key: uniqueId(),
                  tag: undefined,
                  value: undefined,
                  method: undefined,
                },
              ]);
            }}
          >
            添加
          </Button>
          <Table
            rowKey="key"
            dataSource={activedFilters}
            columns={filterColumns}
            pagination={{ pageSize: 5, hideOnSinglePage: true }}
          />
        </>
      ),
    },
  ], [metaGroups, activedFilters, fieldsMap, activedMetric]);

  return (
    <Modal title={title} visible={visible} onOk={handleGetData} onCancel={handleCancel} {...rest}>
      <RenderPureForm layout="vertical" list={fieldsList} />
    </Modal>
  );
};
