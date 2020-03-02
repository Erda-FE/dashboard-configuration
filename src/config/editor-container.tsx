import React from 'react';
import { Drawer } from 'antd';

interface IProps {
  visible: boolean
  children: React.ReactChildren
  onClose(): void
}

export const EditorContainer = ({ visible, onClose, children, ...rest }: IProps) => (
  <Drawer
    placement="bottom"
    mask={false}
    closable={false}
    height="350px"
    visible={visible}
    onClose={onClose}
    {...rest}
  >
    {children}
  </Drawer>
);
