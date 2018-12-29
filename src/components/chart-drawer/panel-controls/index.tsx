import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';

const { Panel } = Collapse;

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const PanelControls = ({ visible, chooseChart, ...others }: IProps) => (
  <Panel {...others} header="控件" key="controls" />
);

const mapStateToProps = ({ biDrawer: { visible } }: any) => ({
  visible,
});

const mapDispatchToProps = (dispatch: any) => ({
  chooseChart() {
    dispatch({ type: 'biDrawer/chooseChart' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelControls);
