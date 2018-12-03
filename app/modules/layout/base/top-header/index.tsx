import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Link } from 'dva/router';
import styles from './index.scss';

const { Header } = Layout;
const { Item } = Breadcrumb;

// @trick Item、Breadcrumb有未知原因的warning
const AppHeader = () => {
  const breadcrumbItems = [
    <Item key="home">
      <Link to="/">首页</Link>
    </Item>,
    <Item key="user">User</Item>,
    <Item key="bill">Bill</Item>];
  return (
    <Header className={styles.header}>
      <Breadcrumb className={styles.breadcrumb} separator=">">
        {breadcrumbItems}
      </Breadcrumb>
    </Header>
  );
};

export default AppHeader;
