import * as React from 'react';
import { map, isUndefined } from 'lodash';
import { Choose, When } from 'tsx-control-statements/components';
import { Input, InputNumber, Select, Switch } from '@terminus/nusi';
import { DcFormModal } from '../../../../../common';
import DashboardStore from '../../../../../stores/dash-board';

const { Group: InputGroup } = Input;
const textMap = DashboardStore.getState((s) => s.textMap);

interface IProps {
  defaultValue: DICE_DATA_CONFIGURATOR.Dimension;
  visible: boolean;
  metricsMap: Record<string, any>;
  typeMap: Record<string, any>;
  onCancel: ((e: React.MouseEvent<any, MouseEvent>) => void) | undefined;
  onOk: (v: any) => void;
}

interface IFilterInputProps {
  value: any;
  onChange(v: any): void;
  fieldType: DICE_DATA_CONFIGURATOR.FieldType;
  options: { label: string; value: string }[];
}

const FilterInput = ({ value, onChange, fieldType, options }: IFilterInputProps) => (
  <InputGroup compact size="small">
    <Select
      allowClear
      value={value?.operation}
      size="small"
      options={options}
      onChange={(v) => onChange({ ...value, operation: v })}
    />
    <Choose>
      <When condition={fieldType === 'number'}>
        <InputNumber
          value={value?.value}
          size="small"
          onChange={(v) => onChange({ ...value, value: v })}
        />
      </When>
      <When condition={fieldType === 'string'}>
        <Input
          style={{ width: 300 }}
          value={value?.value}
          size="small"
          onChange={(e: React.FocusEvent<HTMLInputElement>) => onChange({ ...value, value: e.target.value })}
        />
      </When>
      <When condition={fieldType === 'bool'}>
        <Switch
          defaultChecked={value?.value || false}
          onChange={(v) => onChange({ ...value, value: v })}
        />
      </When>
    </Choose>
  </InputGroup>
);

const CreateFilterModal = ({ defaultValue, metricsMap, typeMap, ...rest }: IProps) => {
  const { field } = defaultValue;
  const fieldType = metricsMap[field as string]?.type;
  const options = map(typeMap[fieldType]?.filters, (v) => ({ value: v.operation, label: v.name }));
  const fields = [
    {
      label: textMap['metric filter'],
      type: FilterInput,
      name: 'filter',
      initialValue: defaultValue.filter,
      validator: [{
        validator: (_: any, value: { operation?: string; value?: any }) => {
          if (value?.operation && !isUndefined(value?.value)) {
            return true;
          }
          return false;
        },
      }],
      customProps: {
        fieldType,
        options,
      }
    },
  ];

  return (
    <DcFormModal
      title={textMap['filter config']}
      fields={fields}
      {...rest}
    />
  );
};

export default CreateFilterModal;
