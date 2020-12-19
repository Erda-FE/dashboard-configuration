import * as React from 'react';
import { Menu, Dropdown } from '@terminus/nusi';

const { Item: MenuItem } = Menu;

interface IProps {
  children: JSX.Element;
  type: DICE_DATA_CONFIGURATOR.DimensionMetricType;
}

export default ({ children, type }: IProps) => {
  const getOverLay = () => {
    return (
      <Menu>
        <MenuItem>
          表达式录入
        </MenuItem>
        <MenuItem key="1">
          <a href="http://www.taobao.com/">2nd menu item</a>
        </MenuItem>
        <Menu.Divider />
        <MenuItem key="3">3rd menu item</MenuItem>
      </Menu>
    );
  };

  return (
    <Dropdown trigger={['click']} overlay={getOverLay()}>
      {children}
    </Dropdown>
  );
};
