import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';

const { Panel } = Collapse;

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const PanelData = ({ visible, chooseChart, ...others }: IProps) => (
  <Panel {...others} header="数据" key="data" />
);

const mapStateToProps = ({ biDrawer: { visible } }: any) => ({
  visible,
});

const mapDispatchToProps = (dispatch: any) => ({
  chooseChart() {
    dispatch({ type: 'biDrawer/chooseChart' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelData);
