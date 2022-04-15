import * as React from 'react';
import { map } from 'lodash';
import { Col, Input, Select } from 'antd';
import { DcFormModal } from 'src/common';
import { insertWhen } from 'src/common/utils';
import DashboardStore from 'src/stores/dash-board';
import { unitInfMap } from 'src/components/DcChartEditor/data-config/dice-form/constants';

const { Group: InputGroup } = Input;

interface IUnitConfigProps {
  value: DICE_DATA_CONFIGURATOR.FieldUnit;
  onChange: (data: DICE_DATA_CONFIGURATOR.FieldUnit) => void;
  size?: 'large' | 'small';
}

const UnitConfig: React.FC<IUnitConfigProps> = ({ value, onChange, size }) => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  const { type, unit } = value || {};
  const units = React.useMemo(() => unitInfMap(textMap), [textMap]);
  const unitMeta = React.useMemo(() => units[type || ''] ?? {}, [type]);
  return (
    <InputGroup size={size}>
      <Col span={6}>
        <Select
          allowClear
          value={type}
          size={size}
          className="field-config-select"
          options={map(units, (item) => ({ label: item.name, value: item.value }))}
          onChange={(v) => onChange({ ...value, type: v, unit: units[v]?.defaultUnit })}
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
          <When condition={!!unitMeta.units}>
            <Select
              value={unit}
              size={size}
              options={map(unitMeta?.units, (item) => ({
                label: item || textMap.null,
                value: item,
              }))}
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
    ...insertWhen(!!isNeedUnit, [
      {
        label: textMap['source data unit config'],
        type: UnitConfig,
        name: 'unit',
        required: false,
        initialValue: defaultValue.unit,
      },
    ]),
  ];

  return <DcFormModal title={textMap['field config']} fields={fields} {...rest} />;
};

export default CreateAliasModal;
