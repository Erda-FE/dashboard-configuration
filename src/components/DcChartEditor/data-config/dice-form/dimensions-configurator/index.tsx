/* 数据指标配置组件
 * @Author: licao
 * @Date: 2020-12-15 20:02:03
 * @Last Modified by: licao
 * @Last Modified time: 2021-01-29 11:17:37
 */
import React, { useMemo, useCallback } from 'react';
import { map, uniqueId, some, remove, find, findIndex, pickBy, isEmpty } from 'lodash';
import { produce } from 'immer';
import { Toast, Cascader, Tag } from '@terminus/nusi';
import { useToggle } from 'react-use';
import { DcIcon, DcInfoIcon, DcDndProvider, useUpdate } from '../../../../../common';
import { insertWhen, cutStr } from '../../../../../common/utils';
import { SPECIAL_METRIC_TYPE, SPECIAL_METRIC, SortMap } from '../constants';
import DashboardStore from '../../../../../stores/dash-board';
import { genDefaultDimension } from '../common/utils';
import CreateExprModal from './create-expr-modal';
import CreateAliasModal from './create-alias-modal';
import CreateTimeModal from './create-time-modal';
import CreateFilterModal from './create-filter-modal';
import DimensionConfigs from './dimension-configs';
import { customFilter, defaultRenderFilteredOption } from '../../../../../utils/cascader-filter';
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
  // 特殊的指标类型，和 props 传入的 type 一致
  const fieldTypes = useMemo(() => [SPECIAL_METRIC_TYPE.filter, SPECIAL_METRIC_TYPE.sort], []);
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
        value: fieldTypes.includes(dimensionType) ? SPECIAL_METRIC[dimensionType] : SPECIAL_METRIC[SPECIAL_METRIC_TYPE.field],
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
  ]), [dimensionType, dimensions, fieldTypes, isTypeDimension, metricsMap]);

  const updateDimension = useCallback((dimension: DICE_DATA_CONFIGURATOR.Dimension) => {
    onChange(produce(dimensions, (draft) => {
      const index = findIndex(dimensions, { key: dimension.key });
      draft[index] = dimension;
    }));
  }, [dimensions, onChange]);

  const handleSubmitModal = (v: Partial<DICE_DATA_CONFIGURATOR.Dimension>) => {
    const isNewDimension = findIndex(dimensions, { key: curDimension.key }) < 0;
    const newDimension = {
      ...curDimension,
      ...v,
    };
    if (isNewDimension) {
      onChange([...dimensions, newDimension]);
    } else {
      updateDimension(newDimension);
    }
    handleCancelModal();
  };

  // 触发操作
  const handleTriggerAction = useCallback((
    key: string,
    type: DICE_DATA_CONFIGURATOR.DimensionConfigsActionType,
    option?: { payload?: any; isUpdateDirectly?: boolean }
  ) => {
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
      updateDimension({ ..._curDimension, ...option?.payload, resultType });
    }
    if (type === 'configSort') {
      updateDimension({ ..._curDimension, ...option?.payload });
    }
    if (type === 'configFilter') {
      toggleFilterModalVisible();
    }
    if (type === 'updateOrder') {
      const { dragIndex, hoverIndex } = option?.payload;
      const newDimensions = produce(dimensions, (draft) => {
        draft[dragIndex] = dimensions[hoverIndex];
        draft[hoverIndex] = dimensions[dragIndex];
      });
      onChange(newDimensions);
    }
  }, [dimensions, updater, metricsMap, toggleExprModalVisible, toggleAliasModalVisible, toggleTimeModalVisible, updateDimension, toggleFilterModalVisible, onChange]);


  const handleAddDimension = useCallback((val: string[]) => {
    toggleSelectVisible();
    const [metricField, field] = val;
    const isExpr = metricField === SPECIAL_METRIC[SPECIAL_METRIC_TYPE.expr];
    const isFilter = metricField === SPECIAL_METRIC[SPECIAL_METRIC_TYPE.filter];
    const isSort = metricField === SPECIAL_METRIC[SPECIAL_METRIC_TYPE.sort];
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

    if (isSort) {
      type = SPECIAL_METRIC_TYPE.sort;
    }

    const newDimension = genDefaultDimension({ type, alias, prefix: dimensionType, field, resultType: metricsMap[field]?.type });

    // 自动打开表达式输入，完成后新增
    if (isExpr) {
      updater.curDimension(newDimension);
      handleTriggerAction(newDimension.key, 'configExpr');
      return;
    }
    // 自动打开筛选输入，完成后新增
    if (isFilter) {
      updater.curDimension(newDimension);
      handleTriggerAction(newDimension.key, 'configFilter');
      return;
    }
    onChange([...dimensions, newDimension]);
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

  return (
    // HOC 包裹
    <DcDndProvider>
      <div className="dc-dice-metric-group dark-dotted-border pa4 border-radius">
        {map(dimensions, ({ key, alias, type, expr, resultType, filter, aggregation, field, sort }, index) => {
          // 表达式未填提示
          const isUncompleted = type === 'expr' && !expr;
          // 别名自动补全显示
          let _alias = alias;
          let aggregationOptions;

          if (['field', 'sort'].includes(type)) {
            aggregationOptions = map(
              typeMap[metricsMap[field as string]?.type]?.aggregations,
              (v) => ({ value: v.aggregation, label: v.name })
            );
            _alias = `${alias}${aggregation ? `-${aggregationMap[aggregation]?.name}` : ''}${sort ? `-${SortMap[sort]?.label}` : ''}`;
          }
          if (type === 'filter' && filter?.operation) {
            _alias = `${alias}(${filtersMap[filter.operation]?.name} ${filter?.value})`;
          }

          return (
            <DimensionConfigs
              key={key}
              index={index}
              type={type}
              dimensionType={dimensionType}
              aggregationOptions={aggregationOptions}
              aggregation={aggregation}
              sort={sort}
              aggregationMap={aggregationMap}
              onTriggerAction={(actionType, option) => handleTriggerAction(key, actionType, option)}
            >
              <Tag
                className="mb8"
                closable
                style={{ background: '#ffffff', border: '#6a549e solid 1px', color: '#6a549e' }}
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
              showSearch={{ filter: customFilter, render: defaultRenderFilteredOption }}
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
              color="#6a549e"
              style={{ lineHeight: '22px', alignSelf: 'start' }}
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
          isNeedUnit={dimensionType === 'value'}
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
    </DcDndProvider>
  );
};

export default DimensionsConfigurator;
