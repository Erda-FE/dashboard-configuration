import * as React from 'react';
import { Button, Dropdown, Input, Menu, message, Modal, Tabs, Tooltip } from 'antd';
import { useImmer } from 'use-immer';
import { find, findIndex, map, remove } from 'lodash';
import { DcIcon, DcInfoIcon } from 'src/common';
import { genUUID, insertWhen } from 'src/common/utils';
import DashboardStore, { TextType } from 'src/stores/dash-board';
import GlobalFiltersStore from 'src/stores/global-filters';

import './config-modal.scss';

type IconType = 'success' | 'info' | 'error' | 'warning';

interface FilterOption {
  icon?: IconType;
  tip?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface IField {
  label: string;
  Comp: any;
  defaultValue?: any;
  value?: any;
  customProps?: Record<string, any>;
  tip?: string;
}

// 实现 fields 布局
const ConfigFields = ({ fields, col = 2 }: { fields: IField[]; col?: number }) => {
  return (
    <div className="dc-config-fields wrap-flex-box py16">
      {fields.map(({ Comp, customProps, label, tip, ...restProps }) => (
        <div className={`mb16 pr16 wd${100 / col}`} key={label}>
          <div className="dc-config-fields-item">
            <div className="label color-text-sub">
              <div>
                <span>{label}</span>
                <If condition={!!tip}>
                  <DcInfoIcon info={tip as string} />
                </If>
              </div>
            </div>
            <Comp {...customProps} {...restProps} />
          </div>
        </div>
      ))}
    </div>
  );
};

const TabPaneOptionsName = ({
  name,
  id,
  enable,
  disableDelete = false,
  removeFilter,
  updateFilter,
}: {
  name: string;
  id: string;
  enable: boolean;
  disableDelete?: boolean;
  removeFilter: (id: string) => void;
  updateFilter: (id: string, filter: Partial<DC_GLOBAL_FILTERS.Filter>) => void;
}) => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  const filterOptions: FilterOption[] = [
    ...insertWhen<FilterOption>(enable, [
      {
        icon: 'eye',
        tip: textMap.disabled,
        onClick(e: React.MouseEvent) {
          e.stopPropagation();
          updateFilter(id, { enable: false });
        },
      },
    ]),
    ...insertWhen<FilterOption>(!enable, [
      {
        icon: 'eye-close',
        tip: textMap.enabled,
        onClick(e: React.MouseEvent) {
          e.stopPropagation();
          updateFilter(id, { enable: true });
        },
      },
    ]),
    ...insertWhen<FilterOption>(!disableDelete, [
      {
        icon: 'delete',
        tip: textMap.delete,
        onClick(e: React.MouseEvent) {
          e.stopPropagation();
          removeFilter(id);
        },
      },
    ]),
  ];

  return (
    <div className="dc-global-filters-config-tab">
      <div className="flex-1 left-text ellipsis-text">{name}</div>
      <div className="dc-global-filters-options">
        {filterOptions.map(({ icon, tip, onClick }) => (
          <Tooltip title={tip} key={icon}>
            <Button className="filter-option" size="small" type="text" key={icon} onClick={onClick}>
              <DcIcon type={icon} />
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export enum FilterType {
  TIME = 'time',
  SEARCH = 'search',
  SELECT = 'select',
  CONSTANT = 'constant',
}

const newFilterOptionMap = (textMap: TextType) => ({
  [FilterType.SEARCH]: {
    name: textMap['input keywords'],
    prefix: 'search',
  },
  [FilterType.SELECT]: {
    name: textMap['select datasource'],
    prefix: 'filter',
  },
});

// 生成默认唯一 filter name
const genDefaultFilterName = (type: DC_GLOBAL_FILTERS.FilterType, textMap: TextType) => {
  return `${newFilterOptionMap(textMap)[type]?.prefix}_${genUUID(3)}`;
};

export const ConfigGlobalFiltersModal = () => {
  const [visible, globalFilters] = GlobalFiltersStore.useStore((s) => [s.configModalVisible, s.globalFilters]);
  const textMap = DashboardStore.getState((s) => s.textMap);
  const { toggleConfigModal, submitFilters } = GlobalFiltersStore;
  const [filters, updateFilters] = useImmer(globalFilters);
  const getFieldsList = ({ name, label, desc, key, placeholder }: DC_GLOBAL_FILTERS.Filter): IField[] => [
    {
      label: textMap.name,
      Comp: Input,
      tip: '用于筛选的唯一 key，必填且注意不可重复',
      value: name,
      customProps: {
        size: 'small',
        onChange(e: React.FocusEvent<HTMLInputElement>) {
          const val = e.target.value;
          if (!val) {
            message.warning('筛选项名称不能为空！');
            updateFilter(key, { name });
            return;
          }
          updateFilter(key, { name: val });
        },
      },
    },
    {
      label: textMap.alias,
      Comp: Input,
      tip: '筛选项 label 名，为空则不显示',
      value: label,
      customProps: {
        size: 'small',
        onChange(e: React.FocusEvent<HTMLInputElement>) {
          updateFilter(key, { label: e.target.value });
        },
      },
    },
    {
      label: textMap.description,
      Comp: Input,
      value: desc,
      customProps: {
        size: 'small',
        onChange(e: React.FocusEvent<HTMLInputElement>) {
          updateFilter(key, { desc: e.target.value });
        },
      },
    },
    {
      label: textMap.placeholder,
      Comp: Input,
      value: placeholder,
      customProps: {
        size: 'small',
        onChange(e: React.FocusEvent<HTMLInputElement>) {
          updateFilter(key, { placeholder: e.target.value });
        },
      },
    },
  ];

  const addFilter = (type: DC_GLOBAL_FILTERS.FilterType) => {
    updateFilters((draft) => {
      const key = genDefaultFilterName(type, textMap);
      draft.push({
        key,
        name: key,
        type,
        enable: true,
      });
    });
  };

  const removeFilter = (key: string) => {
    updateFilters((draft) => {
      remove(draft, (filter) => filter.key === key);
    });
  };

  const updateFilter = (key: string, filter: Partial<DC_GLOBAL_FILTERS.Filter>) => {
    updateFilters((draft) => {
      draft.splice(findIndex(draft, { key }), 1, { ...(find(draft, { key }) as DC_GLOBAL_FILTERS.Filter), ...filter });
    });
  };

  const handleSubmit = () => {
    submitFilters(filters);
    toggleConfigModal(false);
  };

  const handleCancel = () => {
    // reset from globalFilters
    updateFilters((draft) => {
      draft.forEach((_, key) => {
        if (globalFilters[key]) {
          draft[key] = globalFilters[key];
        } else {
          draft.splice(key, 1);
        }
      });
    });
    toggleConfigModal(false);
  };

  return (
    <Modal
      className="dc-global-filters-config"
      visible={visible}
      title={textMap['global filter']}
      width={800}
      bodyStyle={{ background: 'white' }}
      destroyOnClose
      onCancel={handleCancel}
      onOk={handleSubmit}
    >
      <div className="mb12 px12 flex-box">
        <div>{textMap['filter items']}</div>
        <Dropdown
          trigger={['click']}
          placement="bottomRight"
          overlay={
            <Menu>
              {map(newFilterOptionMap, ({ name }, type) => (
                <Menu.Item key={type}>
                  <a onClick={() => addFilter(type as DC_GLOBAL_FILTERS.FilterType)}>{name}</a>
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <Button type="secondary" size="small">
            <DcIcon type="plus" />
          </Button>
        </Dropdown>
      </div>
      <div className="dc-global-filters-config-content">
        <Tabs
          defaultActiveKey="time"
          tabPosition="left"
          size="small"
          // tab 滑动
          style={{ height: 280 }}
        >
          {filters.map((filter) => {
            const { type, name, label, enable, key } = filter;
            return (
              <Tabs.TabPane
                key={key}
                tab={
                  <TabPaneOptionsName
                    name={label || name}
                    id={key}
                    enable={enable}
                    disableDelete={type === 'time'}
                    removeFilter={removeFilter}
                    updateFilter={updateFilter}
                  />
                }
              >
                <If condition={type !== 'time'}>
                  <div className="auto-overflow">
                    <div>通用设置</div>
                    <ConfigFields fields={getFieldsList(filter)} />
                    <div>数据源设置</div>
                    {/* <ConfigFields fields={getFieldsList(filter)} /> */}
                  </div>
                </If>
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </div>
    </Modal>
  );
};
