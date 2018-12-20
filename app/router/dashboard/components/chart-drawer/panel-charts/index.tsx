import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';

const { Panel } = Collapse;

const charts = [
  { type: 'bar', name: '柱状图', img: '', formatMsg: '' },
];

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const PanelCharts = ({ visible, chooseChart, ...others }: IProps) => (
  <Panel {...others} header="图表" key="charts">
    <div>
      {charts.map(({ type, img }) => (
        <div key={type}>
          <img src={img} />
        </div>
      ))}
    </div>
  </Panel>
);

const mapStateToProps = ({ biDrawer: { visible } }: any) => ({
  visible,
});

const mapDispatchToProps = (dispatch: any) => ({
  chooseChart() {
    dispatch({ type: 'biDrawer/chooseChart' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelCharts);
