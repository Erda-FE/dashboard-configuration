import * as React from 'react';
import { Menu, Dropdown } from '@terminus/nusi';
import { map } from 'lodash';
import { If, Choose, When, Otherwise } from 'tsx-control-statements/components';
import DashboardStore from '../../../../../stores/dash-board';
import { DcInfoIcon } from '../../../../../common';
import { DIMENSIONS_CONFIGS, SPECIAL_METRIC_TYPE, COMMON_DIMENSIONS_CONFIGS } from '../constants';

import './index.scss';

const textMap = DashboardStore.getState((s) => s.textMap);
const { Item: MenuItem, Divider: MenuDivider, SubMenu } = Menu;

interface IProps {
  children: JSX.Element;
  type: DICE_DATA_CONFIGURATOR.DimensionMetricType;
  dimensionType: DICE_DATA_CONFIGURATOR.DimensionType;
  aggregation?: string;
  sort?: 'DESC' | 'ASC';
  aggregationMap?: Record<string, DICE_DATA_CONFIGURATOR.AggregationInfo>;
  aggregationOptions?: ComponentOptions;
  onTriggerAction: (type: DICE_DATA_CONFIGURATOR.DimensionConfigsActionType, option?: { payload?: Partial<DICE_DATA_CONFIGURATOR.Dimension>; isUpdateDirectly?: boolean }) => void;
}

const DimensionConfigs = ({
  children,
  type,
  dimensionType,
  aggregationOptions,
  aggregation,
  sort,
  aggregationMap,
  onTriggerAction,
}: IProps) => {
  const child = React.Children.only(children);
  let configs = DIMENSIONS_CONFIGS[type];
  let selectedKeys;

  if (['value', 'type'].includes(dimensionType)) {
    configs = [...configs, ...COMMON_DIMENSIONS_CONFIGS];
  }

  // 维度不需要聚合方法
  if (['field', 'sort'].includes(type) && dimensionType !== 'type') {
    configs = [
      {
        key: SPECIAL_METRIC_TYPE.field,
        label: textMap['metric aggregation'],
        type: 'sub',
        options: aggregationOptions,
      },
      {
        key: 'divider1',
        type: 'divider',
      },
      ...configs,
    ];
    aggregation && (selectedKeys = [aggregation, SPECIAL_METRIC_TYPE.field]);
    sort && (selectedKeys = [sort, SPECIAL_METRIC_TYPE.sort]);
  }

  if (type === 'filter') {
    configs = [
      {
        key: SPECIAL_METRIC_TYPE.filter,
        label: textMap['filter config'],
        actionKey: 'configFilter',
      },
    ];
  }

  const handleClick = ({ keyPath }: any) => {
    const [_val, _type] = keyPath;
    if (_type === SPECIAL_METRIC_TYPE.field) {
      onTriggerAction('configFieldAggregation', {
        payload: {
          aggregation: _val === aggregation ? undefined : _val,
          resultType: _val === aggregation ? undefined : (aggregationMap as Record<string, DICE_DATA_CONFIGURATOR.AggregationInfo>)[_val as string]?.result_type,
        },
        isUpdateDirectly: true,
      });
    }
    if (_type === SPECIAL_METRIC_TYPE.sort) {
      onTriggerAction('configSort', {
        payload: {
          sort: _val === sort ? undefined : _val,
        },
        isUpdateDirectly: true,
      });
    }
  };

  return (
    <Dropdown
      trigger={['click']}
      overlay={
        <Menu
          onClick={handleClick}
          defaultOpenKeys={[SPECIAL_METRIC_TYPE.field]}
          selectedKeys={selectedKeys}
        >
          {
            map(configs, ({ label, info, actionKey, key, type: menuItemType, options }) => (
              <Choose key={key}>
                <When condition={menuItemType === 'divider'}>
                  <MenuDivider />
                </When>
                <When condition={menuItemType === 'sub'}>
                  <SubMenu key={key} title={label}>
                    {map(options, (option) => (
                      <MenuItem key={option.value}>{option.label}</MenuItem>
                    ))}
                  </SubMenu>
                </When>
                <Otherwise>
                  <MenuItem key={key} onClick={() => onTriggerAction(actionKey as DICE_DATA_CONFIGURATOR.DimensionConfigsActionType)}>
                    <span className="dc-editor-dimension-config">
                      {label}
                      <If condition={!!info}><DcInfoIcon info={info as string} /></If>
                    </span>
                  </MenuItem>
                </Otherwise>
              </Choose>
            ))
          }
        </Menu>
      }
    >
      {child}
    </Dropdown>
  );
};

export default DimensionConfigs;
