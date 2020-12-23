/* 数据指标配置组件
 * @Author: licao
 * @Date: 2020-12-15 20:02:03
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-23 11:43:37
 */
import React, { useMemo, useCallback } from 'react';
import { map, uniqueId, some, remove, find, findIndex, isEmpty } from 'lodash';
import { produce } from 'immer';
import { Toast, Cascader, Tag } from '@terminus/nusi';
import { useToggle, useUpdateEffect } from 'react-use';
import { Choose, When, Otherwise, If } from 'tsx-control-statements/components';
import { DcIcon, DcInfoIcon, useUpdate } from '../../../../../common';
import { insertWhen, cutStr } from '../../../../../common/utils';
import { SPECIAL_METRIC_TYPE, SPECIAL_METRIC, CUSTOM_TIME_RANGE_MAP } from '../constants';
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
  aggregationMap: Record<string, any>;
  filtersMap: Record<string, any>;
  type: DICE_DATA_CONFIGURATOR.DimensionType;
  addText?: string;
  disabled?: boolean;
  onChange?: (v: DICE_DATA_CONFIGURATOR.Dimension[]) => void;
}

const DimensionsConfigurator = ({
  value = [],
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
  const [{
    dimensions,
    // 正在编辑的 dimension
    curDimension,
  }, updater] = useUpdate({
    dimensions: value,
    curDimension: {} as unknown as DICE_DATA_CONFIGURATOR.Dimension,
  });

  useUpdateEffect(() => {
    updater.dimensions([]);
    updater.curDimension({} as DICE_DATA_CONFIGURATOR.Dimension);
  }, [metricsMap]);

  // 生成 dimension 分组
  const metricOptions = useMemo(() => ([
    ...insertWhen(dimensionType === 'type', [
      {
        value: SPECIAL_METRIC[SPECIAL_METRIC_TYPE.time],
        label: textMap[SPECIAL_METRIC_TYPE.time],
        disabled: some(dimensions, { type: SPECIAL_METRIC_TYPE.time }),
      },
    ]),
    {
      value: SPECIAL_METRIC[SPECIAL_METRIC_TYPE.field],
      label: textMap.metric,
      children: map(metricsMap, ({ name: label }, key) => ({ value: key, label })),
    },
    {
      value: SPECIAL_METRIC[SPECIAL_METRIC_TYPE.expr],
      label: textMap[SPECIAL_METRIC_TYPE.expr],
    },
  ]), [dimensionType, dimensions, metricsMap]);

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
      handleUpdateDimension({ ..._curDimension, ...option?.payload });
    }
    if (type === 'configFilter') {
      toggleFilterModalVisible()
    }
  }, [dimensions, updater, toggleExprModalVisible, toggleAliasModalVisible, toggleTimeModalVisible, toggleFilterModalVisible]);


  const handleAddDimension = useCallback((val: string[]) => {
    const [metricField, field] = val;
    const isExpr = metricField === SPECIAL_METRIC[SPECIAL_METRIC_TYPE.expr];
    const isFilter = dimensionType === 'filter';
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

    const newDimension = genDefaultDimension({ type, alias, prefix: dimensionType, field });
    updater.dimensions([...dimensions, newDimension]);
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
  }, [metricsMap, dimensions, dimensionType, updater, toggleSelectVisible, handleTriggerAction]);

  const handleUpdateDimension = (dimension: DICE_DATA_CONFIGURATOR.Dimension) => {
    updater.dimensions(produce(dimensions, (draft) => {
      const index = findIndex(dimensions, { key: dimension.key });
      draft[index] = dimension;
    }));
  };

  const handleRemoveDimension = (key: string) => {
    updater.dimensions(produce(dimensions, (draft) => {
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
    <div className="dc-dice-metric-group">
      {map(dimensions, ({ key, alias, type, expr, field, filter, customTime, aggregation }) => {
        // 表达式未填提示
        const isUncompleted = type === 'expr' && !expr;
        // 别名自动显示
        let _alias = alias,
          aggregationOptions;

        if (type === 'time' && !!customTime) {
          _alias = `${alias}-${CUSTOM_TIME_RANGE_MAP[customTime].name}`;
        }
        if (type === 'field') {
          const fieldType = metricsMap[field as string]?.type;

          aggregationOptions = map(
            typeMap[fieldType]?.aggregations,
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
