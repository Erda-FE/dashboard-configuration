import React from 'react';
import { Menu, Icon } from 'antd';
import { last } from 'lodash';
import styles from './index.scss';

const { SubMenu } = Menu;

type IKeys = string[];
interface IState {
  openKeys: IKeys
}

export default class SiderMenu extends React.PureComponent<any, IState> {
  state = {
    openKeys: [],
  };

  onOpenChange = (openKeys: IKeys) => {
    const key = last(openKeys);
    this.setState({ openKeys: key ? [key] : [] });
  }

  render() {
    const { openKeys } = this.state;
    return (
      <Menu
        theme="dark"
        defaultSelectedKeys={['3']}
        mode="inline"
        className={styles.menu}
        openKeys={openKeys}
        onOpenChange={this.onOpenChange}
      >
        <SubMenu
          key="sub1"
          title={<span><Icon type="user" /><span>User</span></span>}
        >
          <Menu.Item key="3">Tom</Menu.Item>
          <Menu.Item key="4">Bill</Menu.Item>
          <Menu.Item key="5">Alex</Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          title={<span><Icon type="team" /><span>Team</span></span>}
        >
          <Menu.Item key="6">Team 1</Menu.Item>
          <Menu.Item key="8">Team 2</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}
