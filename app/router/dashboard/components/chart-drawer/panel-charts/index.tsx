import React from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import { Collapse, Tooltip } from 'antd';
import './index.scss';

const { Panel } = Collapse;

const charts = [
  { type: 'bar', name: '柱状图', img: '/images/charts/bar-heap-on.png' },
  { type: 'line', name: '折线图', img: '/images/charts/line-on.png' },
  { type: 'area', name: '面积图', img: '/images/charts/line-area-on.png' },
  { type: 'pie', name: '饼图', img: '/images/charts/pie-on.png' },
];

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const PanelCharts = ({ chartType, chooseChart, ...others }: IProps) => (
  <Panel {...others} header="图表" key="charts">
    {charts.map(({ type, img, name }) => (
      <div
        key={type}
        className={classnames({ 'bi-drawer-charts': true, active: type === chartType })}
        onClick={() => chooseChart(type)}
      >
        <Tooltip placement="bottom" title={name}>
          <img src={img} />
        </Tooltip>
      </div>
    ))}
  </Panel>
);

const mapStateToProps = ({ biDrawer: { chartType } }: any) => ({
  chartType,
});

const mapDispatchToProps = (dispatch: any) => ({
  chooseChart(chartType: string) {
    dispatch({ type: 'biDrawer/chooseChart', chartType });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelCharts);
