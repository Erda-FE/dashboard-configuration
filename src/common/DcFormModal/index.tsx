import React, { useRef } from 'react';
import { Modal } from 'antd';
import { DcFormBuilder } from '..';
import DashboardStore from '../../stores/dash-board';

interface IProps {
  title?: React.ReactNode;
  visible: boolean;
  fields: any[];
  onCancel?: (e: React.MouseEvent<any, MouseEvent>) => void;
  onOk: (values: any) => void;
}

const DcFormModal = ({ title, visible, fields, onCancel, onOk }: IProps) => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  const ref = useRef(null as any);

  const handleSubmit = () => {
    ref.current?.validateFieldsAndScroll((values: any) => {
      onOk && onOk(values);
    });
    // ref.current?.validateFieldsAndScroll((errors: any, values: any) => {
    //   if (errors) return;
    //   onOk && onOk(values);
    // });
  };

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      maskClosable
      okText={textMap.ok}
      cancelText={textMap.cancel}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <DcFormBuilder fields={fields} ref={ref} />
    </Modal>
  );
};

export { DcFormModal };
