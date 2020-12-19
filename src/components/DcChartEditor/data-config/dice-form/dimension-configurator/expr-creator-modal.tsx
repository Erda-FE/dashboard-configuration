import * as React from 'react';
import { Modal, Input } from '@terminus/nusi';
import { DcFormBuilder } from '../../../../../common';
import DashboardStore from '../../../../../stores/dash-board';

interface IProps {
  visible: boolean;
  defaultValue?: string;
  onCancel?: ((e: React.MouseEvent<any, MouseEvent>) => void) | undefined;
  onOk?: ((e: React.MouseEvent<any, MouseEvent>) => void) | undefined;
}

const textMap = DashboardStore.getState((s) => s.textMap);

const ExprCreatorModal = ({ visible, defaultValue, onCancel, onOk }: IProps) => {
  const fields = [
    {
      label: '表达式',
      type: Input.TextArea,
      name: 'isSqlMode',
      initialValue: defaultValue,
      customProps: {
        maxLength: 1000,
      },
    },
  ];

  return (
    <Modal
      size="small"
      title="表达式录入"
      visible={visible}
      maskClosable
      onCancel={onCancel}
      onOk={onOk}
    >
      <DcFormBuilder fields={fields} />
    </Modal>
  );
};

export default ExprCreatorModal;
