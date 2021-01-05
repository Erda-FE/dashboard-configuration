/* 数据指标配置组件
 * @Author: licao
 * @Date: 2020-12-15 20:02:03
 * @Last Modified by: licao
 * @Last Modified time: 2021-01-05 14:03:24
 */
import React, { useMemo, useCallback } from 'react';
import { map, uniqueId, some, remove, find, findIndex, pickBy, isEmpty } from 'lodash';
import { produce } from 'immer';
import { Toast, Cascader, Tag } from '@terminus/nusi';
import { useToggle } from 'react-use';
import { Choose, When, Otherwise, If } from 'tsx-control-statements/components';
import { DcIcon, DcInfoIcon, useUpdate } from '../../../../../common';
import { insertWhen, cutStr } from '../../../../../common/utils';
import { SPECIAL_METRIC_TYPE, SPECIAL_METRIC } from '../constants';
import DashboardStore from '../../../../../stores/dash-board';
import { genDefaultDimension } from '../common/utils';
import CreateExprModal from './create-expr-modal';
import CreateAliasModal from './create-alias-modal';
import CreateTimeModal from './create-time-modal';
import CreateFilterModal from './create-filter-modal';
import DimensionConfigs from './dimension-configs';

import './index.scss';

const textMap = DashboardStore.getState((s) => s.textMap);
const DEFAULT_TIME_ALIAS = textMap[SPECIAL_METRIC_TYPE.time];
const METRIC_DISPLAY_CHARS_LIMIT = 20;

interface IProps {
  value?: DICE_DATA_CONFIGURATOR.Dimension[];
  metricsMap: Record<string, any>;
  typeMap: Record<string, any>;
  aggregationMap: Record<string, DICE_DATA_CONFIGURATOR.AggregationInfo>;
  filtersMap: Record<string, any>;
  type: DICE_DATA_CONFIGURATOR.DimensionType;
  addText?: string;
  disabled?: boolean;
  onChange: (v?: DICE_DATA_CONFIGURATOR.Dimension[]) => void;
}

const DimensionsConfigurator = ({
  value,
  metricsMap,
  typeMap,
  aggregationMap,
  filtersMap,
  type: dimensionType,
  addText,
  disabled = false,
  onChange,
}: IProps) => {
  const [selectVisible, toggleSelectVisible] = useToggle(false);
  const [exprModalVisible, toggleExprModalVisible] = useToggle(false);
  const [aliasModalVisible, toggleAliasModalVisible] = useToggle(false);
  const [timeModalVisible, toggleTimeModalVisible] = useToggle(false);
  const [filterModalVisible, toggleFilterModalVisible] = useToggle(false);
  const dimensions = useMemo(() => value || [], [value]);
  const [{
    curDimension,
  }, updater] = useUpdate({
    curDimension: {} as unknown as DICE_DATA_CONFIGURATOR.Dimension,
  });

  const isTypeDimension = dimensionType === 'type';
  // 生成 dimension 分组
  const metricOptions = useMemo(() => ([
    ...insertWhen(isTypeDimension, [
      {
        value: SPECIAL_METRIC[SPECIAL_METRIC_TYPE.time],
        label: textMap[SPECIAL_METRIC_TYPE.time],
        disabled: some(dimensions, { type: SPECIAL_METRIC_TYPE.time }),
      },
    ]),
    ...insertWhen(!isEmpty(metricsMap), [
      {
        value: dimensionType === 'filter' ? SPECIAL_METRIC[SPECIAL_METRIC_TYPE.filter] : SPECIAL_METRIC[SPECIAL_METRIC_TYPE.field],
        label: textMap.metric,
        // 维度只需要 string 类型指标
        children: isTypeDimension
          ? map(pickBy(metricsMap, ({ type }) => type === 'string'), ({ name: label }, key) => ({ value: key, label }))
          : map(metricsMap, ({ name: label }, key) => ({ value: key, label })),
      },
    ]),
    {
      value: SPECIAL_METRIC[SPECIAL_METRIC_TYPE.expr],
      label: textMap[SPECIAL_METRIC_TYPE.expr],
    },
  ]), [dimensionType, dimensions, isTypeDimension, metricsMap]);

  const handleUpdateDimension = useCallback((dimension: DICE_DATA_CONFIGURATOR.Dimension) => {
    onChange(produce(dimensions, (draft) => {
      const index = findIndex(dimensions, { key: dimension.key });
      draft[index] = dimension;
    }));
  }, [dimensions, onChange]);

  // 触发操作
  const handleTriggerAction = useCallback((key: string, type: DICE_DATA_CONFIGURATOR.DimensionConfigsActionType, option?: { payload?: any; isUpdateDirectly?: boolean }) => {
    const _curDimension = find(dimensions, { key });
    const isUpdateDirectly = option?.isUpdateDirectly || false;
    _curDimension && !isUpdateDirectly && updater.curDimension(_curDimension);

    if (type === 'configExpr') {
      toggleExprModalVisible();
    }
    if (type === 'configAlias') {
      toggleAliasModalVisible();
    }
    if (type === 'configTime') {
      toggleTimeModalVisible();
    }
    if (type === 'configFieldAggregation') {
      const resultType = option?.payload?.resultType || metricsMap[_curDimension?.field as string]?.type;
      handleUpdateDimension({ ..._curDimension, ...option?.payload, resultType });
    }
    if (type === 'configFilter') {
      toggleFilterModalVisible();
    }
  }, [dimensions, updater, metricsMap, toggleExprModalVisible, toggleAliasModalVisible, toggleTimeModalVisible, handleUpdateDimension, toggleFilterModalVisible]);


  const handleAddDimension = useCallback((val: string[]) => {
    const [metricField, field] = val;
    const isExpr = metricField === SPECIAL_METRIC[SPECIAL_METRIC_TYPE.expr];
    const isFilter = metricField === SPECIAL_METRIC[SPECIAL_METRIC_TYPE.filter];
    let type: DICE_DATA_CONFIGURATOR.DimensionMetricType = SPECIAL_METRIC_TYPE.field;
    let alias: string = metricsMap[field]?.name;

    if (metricField === SPECIAL_METRIC[SPECIAL_METRIC_TYPE.time]) {
      type = SPECIAL_METRIC_TYPE.time;
      alias = DEFAULT_TIME_ALIAS;
    }

    if (isExpr) {
      type = SPECIAL_METRIC_TYPE.expr;
      alias = `${textMap[SPECIAL_METRIC_TYPE.expr]}-${uniqueId()}`;
    }

    if (isFilter) {
      type = SPECIAL_METRIC_TYPE.filter;
    }

    const newDimension = genDefaultDimension({ type, alias, prefix: dimensionType, field, resultType: metricsMap[field]?.type });
    onChange([...dimensions, newDimension]);

    toggleSelectVisible();
    // 自动打开表达式输入
    if (isExpr) {
      updater.curDimension(newDimension);
      handleTriggerAction(newDimension.key, 'configExpr');
    }
    if (isFilter) {
      updater.curDimension(newDimension);
      handleTriggerAction(newDimension.key, 'configFilter');
    }
  }, [dimensionType, metricsMap, onChange, dimensions, toggleSelectVisible, updater, handleTriggerAction]);

  const handleRemoveDimension = (key: string) => {
    onChange(produce(dimensions, (draft) => {
      remove(draft, { key });
    }));
  };

  const resetCurDimension = () => {
    updater.curDimension({} as unknown as DICE_DATA_CONFIGURATOR.Dimension);
  };

  const handleCancelModal = () => {
    resetCurDimension();
    toggleExprModalVisible(false);
    toggleAliasModalVisible(false);
    toggleTimeModalVisible(false);
    toggleFilterModalVisible(false);
  };

  const handleSubmitModal = (v: Partial<DICE_DATA_CONFIGURATOR.Dimension>) => {
    handleUpdateDimension({
      ...curDimension,
      ...v,
    });
    handleCancelModal();
  };

  return (
    <div className="dc-dice-metric-group dark-dotted-border pa4 border-radius">
      {map(dimensions, ({ key, alias, type, expr, resultType, filter, aggregation, field }) => {
        // 表达式未填提示
        const isUncompleted = type === 'expr' && !expr;
        // 别名自动补全显示
        let _alias = alias;
        let aggregationOptions;

        if (type === 'field') {
          aggregationOptions = map(
            typeMap[metricsMap[field as string]?.type]?.aggregations,
            (v) => ({ value: v.aggregation, label: v.name })
          );
          aggregation && (_alias = `${alias}-${aggregationMap[aggregation]?.name}`);
        }
        if (type === 'filter' && filter?.operation) {
          _alias = `${alias}(${filtersMap[filter.operation].name} ${filter?.value})`;
        }

        return (
          <DimensionConfigs
            key={key}
            type={type}
            dimensionType={dimensionType}
            aggregationOptions={aggregationOptions}
            aggregation={aggregation}
            aggregationMap={aggregationMap}
            onTriggerAction={(actionType, option) => handleTriggerAction(key, actionType, option)}
          >
            <Tag
              className="mb8"
              closable
              color={isUncompleted ? 'red' : '#6a549e'}
              afterClose={() => handleRemoveDimension(key)}
            >
              <DcIcon className="mr4" size="small" type="down" />
              <If condition={isUncompleted}>
                <DcInfoIcon size="small" info={textMap['uncompleted input']} />
              </If>
              <If condition={type === 'expr' && !isUncompleted}><DcIcon className="mr4" type="Function" /></If>
              <If condition={type === 'time'}><DcIcon className="mr4" type="time-circle" size="small" /></If>
              <If condition={(['field', 'filter'] as DICE_DATA_CONFIGURATOR.DimensionMetricType[]).includes(type)}>
                <Choose>
                  <When condition={resultType === 'number'}><DcIcon className="mr4" type="Field-number" /></When>
                  <When condition={resultType === 'string'}><DcIcon className="mr4" type="Field-String" /></When>
                </Choose>
              </If>
              {cutStr(_alias, METRIC_DISPLAY_CHARS_LIMIT, { showTip: true })}
            </Tag>
          </DimensionConfigs>
        );
      })}
      <Choose>
        <When condition={selectVisible}>
          <Cascader
            allowClear
            popupVisible
            showSearch
            size="small"
            options={metricOptions}
            style={{ width: 130, alignSelf: 'start' }}
            onPopupVisibleChange={(visible: boolean) => toggleSelectVisible(visible)}
            onChange={handleAddDimension}
          />
        </When>
        <Otherwise>
          <Tag
            onClick={() => {
              if (disabled) {
                Toast.warning(textMap['empty metric group tip']);
                return;
              }
              toggleSelectVisible();
            }}
            style={{ background: '#ffffff', border: '#6a549e solid 1px', lineHeight: '22px', color: '#6a549e', alignSelf: 'start' }}
          >
            <DcIcon type="plus" size="small" className="mr4" />{addText || textMap.add}
          </Tag>
        </Otherwise>
      </Choose>
      <CreateExprModal
        visible={exprModalVisible}
        defaultValue={curDimension}
        onCancel={handleCancelModal}
        onOk={handleSubmitModal}
      />
      <CreateAliasModal
        visible={aliasModalVisible}
        defaultValue={curDimension}
        onCancel={handleCancelModal}
        onOk={handleSubmitModal}
      />
      <CreateTimeModal
        visible={timeModalVisible}
        defaultValue={curDimension}
        metricsMap={metricsMap}
        onCancel={handleCancelModal}
        onOk={handleSubmitModal}
      />
      <CreateFilterModal
        visible={filterModalVisible}
        defaultValue={curDimension}
        metricsMap={metricsMap}
        typeMap={typeMap}
        onCancel={handleCancelModal}
        onOk={handleSubmitModal}
      />
    </div>
  );
};

export default DimensionsConfigurator;
