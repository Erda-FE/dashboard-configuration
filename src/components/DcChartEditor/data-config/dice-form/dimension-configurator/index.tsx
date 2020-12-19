/* 数据指标配置组件
 * @Author: licao 
 * @Date: 2020-12-15 20:02:03 
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-18 00:49:37
 */
import React, { useRef, useEffect, useLayoutEffect, useMemo, useCallback } from 'react';
import { isEmpty, map, uniqueId, some, remove } from 'lodash';
import { produce } from 'immer';
import { Toast, Select, Cascader, Tag, Dropdown, Menu } from '@terminus/nusi';
import { useToggle } from 'react-use';
import { Choose, When, Otherwise } from 'tsx-control-statements/components';
import { DcIcon, useUpdate } from '../../../../../common';
import { insertWhen } from '../../../../../common/utils';
import { SPECIAL_METRIC_TYPE, SPECIAL_METRIC } from '../constants';
import { genDefaultDimension } from '../common/utils';
import { cutStr } from '../../../../../common/utils';
import ExprDimensionConfigs from './expr-dimension-configs';
import DashboardStore from '../../../../../stores/dash-board';

import './index.scss';

const textMap = DashboardStore.getState((s) => s.textMap);
const { Option: SelectOption } = Select;
const METRIC_DISPLAY_CHARS_LIMIT = 20;

interface IProps {
  value?: DICE_DATA_CONFIGURATOR.Dimension[];
  metricsMap: Record<string, any>;
  type: DICE_DATA_CONFIGURATOR.DimensionType,
  disabled?: boolean;
  onChange?(v: DICE_DATA_CONFIGURATOR.Dimension[]): void;
}

export default ({
  value = [],
  metricsMap,
  type: dimensionType,
  disabled = false,
  onChange,
}: IProps) => {
  const [selectVisible, toggleSelectVisible] = useToggle(false);
  const [{ dimensions }, updater] = useUpdate({
    dimensions: value,
  });

  // 生成 dimension 分组
  const metricOptions = useMemo(() => ([
    ...insertWhen(dimensionType === 'type', [        
      {
        value: SPECIAL_METRIC[SPECIAL_METRIC_TYPE.time],
        label: textMap[SPECIAL_METRIC_TYPE.time],
        disabled: some(dimensions, { type: SPECIAL_METRIC_TYPE.time })
      },
    ]),
    {
      value: SPECIAL_METRIC[SPECIAL_METRIC_TYPE.field],
      label: textMap.metric,
      children: map(metricsMap, ({ name: label }, value) => ({ value, label }))
    },
    {
      value: SPECIAL_METRIC[SPECIAL_METRIC_TYPE.expr],
      label: textMap[SPECIAL_METRIC_TYPE.expr]
    }
  ]), [metricsMap, dimensions]);

  const handleAddDimension = useCallback((val: string[]) => {
    const [metricField, field] = val;
    let type: DICE_DATA_CONFIGURATOR.DimensionMetricType = SPECIAL_METRIC_TYPE.field,
      alias: string = metricsMap[field]?.name;

    if (metricField === SPECIAL_METRIC[SPECIAL_METRIC_TYPE.time]) {
      type = SPECIAL_METRIC_TYPE.time;
      alias = textMap[SPECIAL_METRIC_TYPE.time];
    }

    if (metricField ===  SPECIAL_METRIC[SPECIAL_METRIC_TYPE.expr]) {
      type = SPECIAL_METRIC_TYPE.expr;
      alias = `${textMap[SPECIAL_METRIC_TYPE.expr]}-${uniqueId()}`;
    }

    updater.dimensions([...dimensions, genDefaultDimension({ type, alias, prefix: dimensionType, field })]);
    toggleSelectVisible();
  }, [metricsMap, dimensions, updater]);

  const handleRemoveDimension = useCallback((key: string) => {
    updater.dimensions(produce(dimensions, draft => {
      remove(draft, { key });
    }))
  }, [dimensions, updater]);

  const getDimensionsConfigsMenu = (type: DICE_DATA_CONFIGURATOR.DimensionMetricType) => {
    if (type === SPECIAL_METRIC_TYPE.expr) {
      return <ExprDimensionConfigs />;
    }
    
    return (
      <Menu>
        <Menu.Divider />
        <Menu.Item key="3">3rd menu item</Menu.Item>
      </Menu>
    );
  }

  return (
    <div className="dc-dice-metric-group">
      {map(dimensions, ({ key, alias, type }) => (
        <Dropdown key={key} trigger={['click']} overlay={getDimensionsConfigsMenu(type)}>         
          <Tag
            className="mb8"
            closable
            color="#6a549e"
            afterClose={() => handleRemoveDimension(key)}
          >
            <DcIcon className="mr4" size="small" type="down" />
            {cutStr(alias, METRIC_DISPLAY_CHARS_LIMIT, { showTip: true })}
          </Tag>
        </Dropdown>
      ))}
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
            <DcIcon type="plus" size="small" className="mr4" />{textMap['add metric']}
          </Tag>
        </Otherwise>
      </Choose>
    </div>
  );
};
