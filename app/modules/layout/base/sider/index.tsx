import React from 'react';
import { Layout } from 'antd';
import classnames from 'classnames';
import { Link } from 'dva/router';
import { Icon as ColorIcon } from 'common';
import SiderMenu from './menu';
import styles from './index.scss';

const { Sider } = Layout;

export default class AppSidebar extends React.PureComponent {
  state = {
    collapsed: false,
  };

  onCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const { collapsed } = this.state;
    return (
      <Sider
        collapsible
        collapsed={collapsed}
        className={styles.sider}
        trigger={(
          <div className={styles.trigger} onClick={this.onCollapse}>
            <ColorIcon
              className="trigger-icon"
              type={collapsed ? 'open' : 'close'}
            />
          </div>
        )}
      >
        <Link to="/">
          <div className={classnames('logo', { collapsed })} />
        </Link>
        <SiderMenu />
      </Sider>
    );
  }
}
