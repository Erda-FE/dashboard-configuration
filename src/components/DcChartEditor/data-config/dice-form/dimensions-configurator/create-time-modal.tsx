import React from 'react';
import { Input, InputNumber, Select } from 'antd';
import { filter, map } from 'lodash';
import { DcFormModal } from 'src/common';
import DashboardStore from 'src/stores/dash-board';
import {
  TIME_FIELDS_UNITS,
  TIME_FORMATS,
  timeIntervals,
} from 'src/components/DcChartEditor/data-config/dice-form/constants';

const { Group: InputGroup } = Input;

interface IProps {
  defaultValue: DICE_DATA_CONFIGURATOR.Dimension;
  visible: boolean;
  metricsMap: Record<string, any>;
  onCancel: ((e: React.MouseEvent<any, MouseEvent>) => void) | undefined;
  onOk: (v: any) => void;
}

const CustomTimeInput = ({ value, onChange }: any) => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  return (
    <InputGroup compact size="small">
      <InputNumber
        value={value?.value}
        min={1}
        precision={0}
        size="small"
        style={{ width: 160 }}
        onChange={(v) => onChange({ ...value, value: v })}
      />
      <Select
        allowClear
        style={{ width: 64 }}
        value={value?.unit}
        size="small"
        options={timeIntervals(textMap)}
        onChange={(v) => onChange({ ...value, unit: v })}
      />
    </InputGroup>
  );
};

const CustomTimeField = ({ value, onChange, options }: any) => (
  <InputGroup compact size="small">
    <Select
      showSearch
      allowClear
      value={value?.value}
      size="small"
      style={{ width: 160 }}
      options={options}
      onChange={(v) => onChange({ ...value, value: v })}
    />
    <Select
      allowClear
      value={value?.unit}
      size="small"
      style={{ width: 64 }}
      options={TIME_FIELDS_UNITS}
      onChange={(v) => onChange({ ...value, unit: v })}
    />
  </InputGroup>
);

const CreateTimeModal = ({ defaultValue, metricsMap, ...rest }: IProps) => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  const fields = [
    {
      label: textMap['custom time metric'],
      type: CustomTimeField,
      name: 'timeField',
      required: false,
      initialValue: defaultValue.timeField,
      customProps: {
        options: map(filter(metricsMap, { type: 'number' }), ({ name: label, key }) => ({ label, value: key })),
      },
    },
    {
      label: textMap['custom time interval'],
      type: CustomTimeInput,
      name: 'timeInterval',
      initialValue: defaultValue.timeInterval,
      required: false,
    },
    {
      label: textMap['time format'],
      type: Select,
      name: 'timeFormat',
      initialValue: defaultValue.timeFormat,
      required: false,
      customProps: {
        options: TIME_FORMATS,
        allowClear: true,
        style: { width: 224 },
      },
    },
  ];

  return <DcFormModal title={textMap['time config']} fields={fields} {...rest} />;
};

export default CreateTimeModal;
