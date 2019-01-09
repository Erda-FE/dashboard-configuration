import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const { Panel } = Collapse;

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const PanelSettings = ({ visible, chooseChart, ...others }: IProps) => (
  <Panel {...others} header="配置" key="settings" />
);

const mapStateToProps = ({ biDrawer: { visible } }: any) => ({
  visible,
});

const mapDispatchToProps = (dispatch: any) => ({
  chooseChart() {
    dispatch({ type: 'biDrawer/chooseChart' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelSettings);
