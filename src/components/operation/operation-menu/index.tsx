import React from 'react';
import { connect } from 'dva';
import { find } from 'lodash';
import { Icon, Menu, Popconfirm, Dropdown } from 'antd';
import { getKeyValue } from '../utils';

interface IProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  chartId: string
}

class OperationMenu extends React.PureComponent<IProps> {
  deleteChart = () => {
    this.props.deleteChart(this.props.chartId);
  }

  doAction = ({ key }: any) => {
    switch (key) {
      case 'edit':
        return this.props.editChart(this.props.chartId);
      case 'link':
        return this.props.openLinkSetting(this.props.chartId);
      default:
        break;
    }
  }

  deleteLink = (e: any) => {
    e.stopPropagation();
    this.props.deleteLinkMap(this.props.chartId);
  }

  getMenu = () => (
    <Menu onClick={this.doAction}>
      <Menu.Item key="edit">编辑</Menu.Item>
      <Menu.Item key="link" disabled={this.props.canLinked}>
        <span>联动设置</span>
        {this.props.hasLinked && <Icon type="delete" onClick={this.deleteLink} style={{ marginLeft: 8, marginRight: 0 }} />}
      </Menu.Item>
      <Menu.Item key="delete">
        <Popconfirm
          okText="确认"
          cancelText="取消"
          placement="top"
          title="是否确认删除"
          onConfirm={this.deleteChart}
        >删除
        </Popconfirm>
      </Menu.Item>
    </Menu>
  )

  render() {
    return (
      <Dropdown overlay={this.getMenu()}>
        <Icon type="dash" />
      </Dropdown>
    );
  }
}

const mapStateToProps = ({ linkSetting: { linkMap } }: any, { chartId }: any) => {
  const { clickId } = getKeyValue(linkMap, chartId);
  return {
    canLinked: !!clickId, // 是否可以进行联动设置
    hasLinked: !!find(linkMap[chartId], value => value), // 是否已经设置了联动
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  editChart(chartId: string) {
    dispatch({ type: 'biDrawer/editChart', chartId });
  },
  deleteChart(chartId: string) {
    dispatch({ type: 'biDashBoard/deleteChart', chartId });
  },
  openLinkSetting(linkId: string) {
    dispatch({ type: 'linkSetting/openLinkSetting', linkId });
  },
  deleteLinkMap(linkId: string) {
    dispatch({ type: 'linkSetting/deleteLinkMap', linkId });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationMenu);
