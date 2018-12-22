import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { chartNameMap } from 'dashboard/utils';
import './index.scss';

const { Panel } = Collapse;

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const PanelData = ({ chartType, chooseChart, ...others }: IProps) => (
  <Panel {...others} header="数据" key="data">
    {chartType && (
      <div className="bi-demo-text">{`${chartNameMap[chartType]}数据示例复制`}</div>
    )}
  </Panel>
);

const mapStateToProps = ({ biDrawer: { chartType } }: any) => ({
  chartType,
});

const mapDispatchToProps = (dispatch: any) => ({
  chooseChart() {
    dispatch({ type: 'biDrawer/chooseChart' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelData);
