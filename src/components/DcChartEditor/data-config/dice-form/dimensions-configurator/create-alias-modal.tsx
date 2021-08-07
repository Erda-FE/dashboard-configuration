import * as React from 'react';
import { map } from 'lodash';
import { Input, Col } from '@terminus/nusi';
import { Select } from 'antd';
import { DcFormModal } from '../../../../../common';
import DashboardStore from '../../../../../stores/dash-board';
import { unitInfMap } from '../constants';

const { Group: InputGroup } = Input;

const UnitConfig = ({ value, onChange, size }: { value?: DICE_DATA_CONFIGURATOR.FieldUnit;[k: string]: any }) => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  const { type, unit } = value || {};
  return (
    <InputGroup size={size}>
      <Col span={6}>
        <Select
          allowClear
          value={type}
          size={size}
          options={map(unitInfMap(textMap), (item) => ({ label: item.name, value: item.value }))}
          onChange={(v) => onChange({ ...value, type: v, unit: unitInfMap(textMap)[v]?.defaultUnit })}
        />
      </Col>
      <Col span={8}>
        <Choose>
          <When condition={type === 'CUSTOM'}>
            <Input
              value={unit}
              size={size}
              maxLength={10}
              placeholder={textMap['input custom unit']}
              onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                onChange({ ...value, unit: e.target.value });
              }}
            />
          </When>
          <When condition={!!unitInfMap(textMap)[type || '']?.units}>
            <Select
              value={unit}
              size={size}
              options={map(unitInfMap(textMap)[type || '']?.units, (item) => ({ label: item || textMap.null, value: item }))}
              onChange={(v) => onChange({ ...value, unit: v })}
            />
          </When>
        </Choose>
      </Col>
    </InputGroup>
  );
};


interface IProps {
  defaultValue: DICE_DATA_CONFIGURATOR.Dimension;
  visible: boolean;
  isNeedUnit?: boolean;
  onCancel: ((e: React.MouseEvent<any, MouseEvent>) => void) | undefined;
  onOk: (v: any) => void;
}

const CreateAliasModal = ({ defaultValue, isNeedUnit, ...rest }: IProps) => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  const fields = [
    {
      label: textMap.alias,
      type: Input,
      name: 'alias',
      required: false,
      initialValue: defaultValue.alias,
      customProps: {
        maxLength: 50,
      },
    },
    {
      label: textMap['source data unit config'],
      type: UnitConfig,
      name: 'unit',
      show: () => isNeedUnit,
      required: false,
      initialValue: defaultValue.unit,
    },
  ];

  return (
    <DcFormModal
      title={textMap['field config']}
      fields={fields}
      {...rest}
    />
  );
};

export default CreateAliasModal;
