import * as React from 'react';
import { Menu } from '@terminus/nusi';

const { Item: MenuItem } = Menu;

export default () => {
  return (
    <Menu>
      <MenuItem key="0">
        <a href="http://www.alipay.com/">1st menu item</a>
      </MenuItem>
      <MenuItem key="1">
        <a href="http://www.taobao.com/">2nd menu item</a>
      </MenuItem>
      <Menu.Divider />
      <MenuItem key="3">3rd menu item</MenuItem>
    </Menu>
  );
}