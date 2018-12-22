import React from 'react';
import { connect } from 'dva';
import { Icon, Dropdown, Menu, Popconfirm } from 'antd';
import './index.scss';

interface IProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  chartId: string
}

class ChartOperation extends React.PureComponent<IProps> {
  deleteChart = () => {
    this.props.deleteChart(this.props.chartId);
  }

  doAction = ({ key }: any) => {
    console.log('key', key);
  }

  getMenu = () => (
    <Menu onClick={this.doAction}>
      <Menu.Item key="edit">编辑</Menu.Item>
      <Menu.Item key="delete">
        <Popconfirm
          okText="确认"
          cancelText="取消"
          placement="top"
          title="是否确认删除"
          onConfirm={this.deleteChart}
        >
            删除
        </Popconfirm>
      </Menu.Item>
    </Menu>
  )

  render() {
    const { children } = this.props;
    return (
      <div className="bi-chart-operation">
        <div className="bi-chart-operation-header">
          <Dropdown overlay={this.getMenu()}>
            <Icon type="dash" />
          </Dropdown>
        </div>
        {children}
      </div>
    );
  }
}

const mapStateToProps = ({ biDashBoard: { layout, chartDatasMap } }: any) => ({
  layout,
  chartDatasMap,
});

const mapDispatchToProps = (dispatch: any) => ({
  deleteChart(chartId: string) {
    dispatch({ type: 'biDashBoard/deleteChart', chartId });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartOperation);
