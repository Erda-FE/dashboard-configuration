import * as React from 'react';
import { Input } from '@terminus/nusi';
import { DcFormModal } from '../../../../../common';
import DashboardStore from '../../../../../stores/dash-board';

interface IProps {
  defaultValue: DICE_DATA_CONFIGURATOR.Dimension;
  visible: boolean;
  onCancel: ((e: React.MouseEvent<any, MouseEvent>) => void) | undefined;
  onOk: (v: any) => void;
}

const CreateExprModal = ({ defaultValue, ...rest }: IProps) => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  const fields = [
    {
      label: textMap.expr,
      type: Input.TextArea,
      name: 'expr',
      initialValue: defaultValue.expr,
      customProps: {
        maxLength: 1000,
      },
    },
  ];

  return (
    <DcFormModal
      title={textMap['expr input']}
      fields={fields}
      {...rest}
    />
  );
};

export default CreateExprModal;
