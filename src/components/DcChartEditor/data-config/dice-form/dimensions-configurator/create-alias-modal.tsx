import * as React from 'react';
import { Input } from '@terminus/nusi';
import { DcFormModal } from '../../../../../common';
import DashboardStore from '../../../../../stores/dash-board';

const textMap = DashboardStore.getState((s) => s.textMap);

interface IProps {
  defaultValue: DICE_DATA_CONFIGURATOR.Dimension;
  visible: boolean;
  onCancel: ((e: React.MouseEvent<any, MouseEvent>) => void) | undefined;
  onOk: (v: any) => void;
}

const CreateAliasModal = ({ defaultValue, ...rest }: IProps) => {
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
