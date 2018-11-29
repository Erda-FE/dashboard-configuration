import React from 'react';
import { Layout, Breadcrumb } from 'antd';

const { Header } = Layout;

const AppHeader = () => (
  <Header style={{ background: '#fff', padding: 0 }}>
    <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>User</Breadcrumb.Item>
      <Breadcrumb.Item>Bill</Breadcrumb.Item>
    </Breadcrumb>
  </Header>
);

export default AppHeader;
