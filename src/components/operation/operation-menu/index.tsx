import { Dropdown, Icon, Menu } from 'antd';
import { find } from 'lodash';
import React from 'react';
import { getKeyValue } from '../utils';

interface IProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  viewId: string
}

class OperationMenu extends React.PureComponent<IProps> {
  doAction = ({ key }: any) => {
    switch (key) {
      case 'link':
        return this.props.openLinkSetting(this.props.viewId);
      default:
        break;
    }
  }

  deleteLink = (e: any) => {
    e.stopPropagation();
    this.props.deleteLinkMap(this.props.viewId);
  }

  getMenu = () => (
    <Menu onClick={this.doAction}>
      <Menu.Item key="link" disabled={this.props.canLinked}>
        <span>联动设置</span>
        {this.props.hasLinked && <Icon type="delete" onClick={this.deleteLink} style={{ marginLeft: 8, marginRight: 0 }} />}
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

const mapStateToProps = ({ linkSetting: { linkMap } }: any, { viewId }: any) => {
  const { clickId } = getKeyValue(linkMap, viewId);
  return {
    canLinked: !!clickId, // 是否可以进行联动设置
    hasLinked: !!find(linkMap[viewId], value => value), // 是否已经设置了联动
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  openLinkSetting(linkId: string) {
    dispatch({ type: 'linkSetting/openLinkSetting', linkId });
  },
  deleteLinkMap(linkId: string) {
    dispatch({ type: 'linkSetting/deleteLinkMap', linkId });
  },
});

export default (p: any) => <OperationMenu {...p} />;
