import React, { useRef } from 'react';
import { Dropdown } from 'antd';
import { Menu } from '@terminus/nusi';
import { map } from 'lodash';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import DashboardStore from '../../../../../stores/dash-board';
import { DcInfoIcon } from '../../../../../common';
import { dimensionsConfigs, SPECIAL_METRIC_TYPE } from '../constants';

import './index.scss';

const { Item: MenuItem, Divider: MenuDivider, SubMenu } = Menu;

interface IProps {
  index: number;
  children: JSX.Element;
  type: DICE_DATA_CONFIGURATOR.DimensionMetricType;
  dimensionType: DICE_DATA_CONFIGURATOR.DimensionType;
  aggregation?: string;
  sort?: 'DESC' | 'ASC';
  aggregationMap?: Record<string, DICE_DATA_CONFIGURATOR.AggregationInfo>;
  aggregationOptions?: ComponentOptions;
  onTriggerAction: (type: DICE_DATA_CONFIGURATOR.DimensionConfigsActionType, option?: { payload?: any; isUpdateDirectly?: boolean }) => void;
}

interface DragItem {
  index: number;
  type: string;
}

const DimensionConfigs = ({
  index,
  children,
  type,
  dimensionType,
  aggregationOptions,
  aggregation,
  sort,
  aggregationMap,
  onTriggerAction,
}: IProps) => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  const COMMON_dimensionsConfigs = [
    {
      key: 'alias',
      label: textMap['field config'],
      actionKey: 'configAlias',
    },
  ];
  // 拖拽交互相关
  const dimensionsWrapperRef = useRef<any>(null);
  // drop 必须操作 DOM 元素
  const [, drop] = useDrop({
    accept: dimensionType,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!dimensionsWrapperRef.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      // 如果 hover 在自己身上则 return
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = dimensionsWrapperRef.current?.getBoundingClientRect();
      // 获取元素高的一半、宽的一半
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      // 向下移动的距离
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY && hoverClientX > hoverMiddleX) return;
      onTriggerAction('updateOrder', { payload: { dragIndex, hoverIndex }, isUpdateDirectly: true });
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });
  // 注册 DragSource
  const [{ isDragging }, drag] = useDrag({
    // 传入被拖拽对象的 props
    item: { type: dimensionType, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(dimensionsWrapperRef));

  const child = React.Children.only(children);
  let configs = dimensionsConfigs(textMap)[type];
  let selectedKeys;

  if (['value', 'type'].includes(dimensionType)) {
    configs = [...configs, ...COMMON_dimensionsConfigs];
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

  const style = {
    opacity: isDragging ? 0 : 1,
    cursor: isDragging ? 'move' : 'pointer',
  };

  return (
    <Dropdown
      trigger={['click']}
      // getPopupContainer={(e) => e.parentElement}
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
      <div ref={dimensionsWrapperRef} style={style}>
        {child}
      </div>
    </Dropdown>
  );
};

export default DimensionConfigs;
