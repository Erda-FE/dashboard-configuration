import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

interface IProps {
  children: string | React.ReactNode | (() => React.ReactNode)
}

// 移除 app-shell的html和css，并显示content的内容
const showContent = () => {
  const $pmp_skeleton = document.querySelector('#skeleton');
  const $pmp_content = document.querySelector('#content');
  if ($pmp_skeleton) $pmp_skeleton.innerHTML = '';
  if ($pmp_content) $pmp_content.classList.remove('hide');
};

export default class AppLayout extends React.PureComponent<IProps> {
  state = {
    collapsed: false,
  };

  componentDidMount() {
    showContent();
  }

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>Option 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span>Option 2</span>
            </Menu.Item>
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
            <Menu.Item key="9">
              <Icon type="file" />
              <span>File</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
          </Header>
          <Content style={{ margin: '16px' }}>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
