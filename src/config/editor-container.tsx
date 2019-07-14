import React from 'react';
import { Drawer } from 'antd';

interface IProps {
  visible: boolean
  children: React.ReactChildren
  onClose(): void
}

export const EditorContainer = ({ visible, onClose, children, ...rest }: IProps) => {
  return (
    <Drawer
      placement="right"
      mask={false}
      closable={false}
      width="70%"
      className="bi-config-editor"
      visible={visible}
      onClose={onClose}
      {...rest}
    >
      {children}
    </Drawer>
  );
};
