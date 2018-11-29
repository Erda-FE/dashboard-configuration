import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import Sider from './sider';

const { Header, Content } = Layout;

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
  componentDidMount() {
    showContent();
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider />
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
