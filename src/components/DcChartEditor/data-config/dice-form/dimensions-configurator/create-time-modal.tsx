import * as React from 'react';
import { Select, Input, InputNumber } from '@terminus/nusi';
import { map, filter } from 'lodash';
import { DcFormModal } from '../../../../../common';
import DashboardStore from '../../../../../stores/dash-board';
import { TIME_INTERVALS, TIME_FORMATS, CUSTOM_TIME_RANGE_MAP, TIME_FIELDS_UNITS } from '../constants';

const textMap = DashboardStore.getState((s) => s.textMap);
const { Group: InputGroup } = Input;

interface IProps {
  defaultValue: DICE_DATA_CONFIGURATOR.Dimension;
  visible: boolean;
  metricsMap: Record<string, any>;
  onCancel: ((e: React.MouseEvent<any, MouseEvent>) => void) | undefined;
  onOk: (v: any) => void;
}

const CustomTimeInput = ({ value, onChange }: any) => (
  <InputGroup compact size="small">
    <InputNumber
      value={value?.value}
      min={1}
      precision={0}
      size="small"
      onChange={(v) => onChange({ ...value, value: v })}
    />
    <Select
      allowClear
      value={value?.unit}
      size="small"
      options={TIME_INTERVALS}
      onChange={(v) => onChange({ ...value, unit: v })}
    />
  </InputGroup>
);

const CustomTimeField = ({ value, onChange, options }: any) => (
  <InputGroup compact size="small">
    <Select
      showSearch
      allowClear
      value={value?.value}
      size="small"
      options={options}
      onChange={(v) => onChange({ ...value, value: v })}
    />
    <Select
      allowClear
      value={value?.unit}
      size="small"
      options={TIME_FIELDS_UNITS}
      onChange={(v) => onChange({ ...value, unit: v })}
    />
  </InputGroup>
);

const CreateTimeModal = ({ defaultValue, metricsMap, ...rest }: IProps) => {
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
      },
    },
  ];

  return (
    <DcFormModal
      title={textMap['time config']}
      fields={fields}
      {...rest}
    />
  );
};

export default CreateTimeModal;
