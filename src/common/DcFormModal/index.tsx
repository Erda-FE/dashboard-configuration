import React, { useRef } from 'react';
import { Modal } from '@terminus/nusi';
import { DcFormBuilder } from '..';

interface IProps {
  title?: React.ReactNode;
  visible: boolean;
  fields: any[];
  onCancel?: ((e: React.MouseEvent<any, MouseEvent>) => void);
  onOk: ((values: any) => void);
}

const DcFormModal = ({ title, visible, fields, onCancel, onOk }: IProps) => {
  const ref = useRef(null as any);

  const handleSubmit = () => {
    ref.current?.validateFieldsAndScroll((errors: any, values: any) => {
      if (errors) return;
      onOk && onOk(values);
    });
  };

  return (
    <Modal
      size="small"
      destroyOnClose
      title={title}
      visible={visible}
      maskClosable
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <DcFormBuilder fields={fields} ref={ref} />
    </Modal>
  );
};

export { DcFormModal };
