import * as React from 'react';
import { Select, Input, InputNumber } from '@terminus/nusi';
import { map, filter } from 'lodash';
import { DcFormModal } from '../../../../../common';
import DashboardStore from '../../../../../stores/dash-board';
import { TIME_INTERVALS, TIME_FORMATS, CUSTOM_TIME_RANGE_MAP } from '../constants';

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

const CreateTimeModal = ({ defaultValue, metricsMap, ...rest }: IProps) => {
  const fields = [
    {
      label: textMap['custom time metric'],
      type: Select,
      name: 'timeField',
      required: false,
      initialValue: defaultValue.timeField,
      customProps: {
        options: map(filter(metricsMap, { type: 'number' }), ({ name: label, key }) => ({ label, value: key })),
        allowClear: true,
        showSearch: true,
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
    {
      label: textMap['fixed time range'],
      type: Select,
      name: 'customTime',
      initialValue: defaultValue.customTime,
      required: false,
      customProps: {
        options: map(CUSTOM_TIME_RANGE_MAP, ({ name: label }, value) => ({ label, value })),
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
