import React, { FocusEvent, useEffect, useState } from 'react';
import produce from 'immer';
import { get, map } from 'lodash';
import { Input, Select } from 'antd';
import { CommonConfigurator } from 'src/components/DcCharts/common';
import ChartEditorStore from 'src/stores/chart-editor';
import DashboardStore from 'src/stores/dash-board';

interface RowEventConfigProps {
  value?: DC_COMPONENT_TABLE.IRowClick;
  options: DICE_DATA_CONFIGURATOR.Dimension[];
  onChange: (v: DC_COMPONENT_TABLE.IRowClick) => void;
}

// 指定表格行点击事件，用于外部嵌入大盘约定与外部的事件及数据
const RowEventConfig = ({ value, options, onChange }: RowEventConfigProps) => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  const [eName, setEName] = useState<string | undefined>(value?.name);
  const [eValue, setEValue] = useState<string | undefined>(value?.value);

  useEffect(() => {
    eName && eValue && onChange({ name: eName, value: eValue });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eName, eValue]);

  return (
    <div className="v-flex-box">
      <Input
        className="mb8"
        placeholder={textMap['event name']}
        defaultValue={value?.name}
        onBlur={(e: FocusEvent<HTMLInputElement>) => setEName(e.target.value)}
      />
      <Select
        allowClear
        defaultValue={value?.value}
        placeholder={textMap['event value']}
        onChange={(v) => setEValue(v)}
      >
        {map(options, (option) => (
          <Select.Option value={option.key} key={option.key}>
            {option.alias}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default () => {
  const { updateEditor } = ChartEditorStore;
  const textMap = DashboardStore.getState((s) => s.textMap);
  const viewCopy = ChartEditorStore.useStore((s) => s.viewCopy as DC.View);
  const currentChartConfig = viewCopy?.config || {};
  const valueDimensions = get(currentChartConfig, 'dataSourceConfig.valueDimensions') || [];
  const typeDimensions = get(currentChartConfig, 'dataSourceConfig.typeDimensions') || [];
  const rowClick = get(currentChartConfig, 'optionProps.rowClick') as DC_COMPONENT_TABLE.IRowClick;

  const updateOptionProps = (_optionProps: Record<string, any>) => {
    updateEditor({
      config: produce(currentChartConfig, (draft) => {
        draft.optionProps = {
          ...(currentChartConfig.optionProps || {}),
          ..._optionProps,
        };
      }),
    });
  };

  const fields = [
    {
      label: textMap['table row click'],
      name: 'rowClick',
      type: RowEventConfig,
      required: false,
      initialValue: rowClick,
      customProps: {
        options: [...typeDimensions, ...valueDimensions],
        onChange(v: DC_COMPONENT_TABLE.IRowClick) {
          updateOptionProps({ rowClick: v });
        },
      },
    },
  ];

  return <CommonConfigurator fields={fields} />;
};
