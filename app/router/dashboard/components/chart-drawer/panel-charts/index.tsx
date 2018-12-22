import React from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import { Collapse, Tooltip } from 'antd';
import { chartNameMap } from 'dashboard/utils';
import './index.scss';

const { Panel } = Collapse;

const charts = [
  { type: 'bar', img: '/images/charts/bar-heap-on.png' },
  { type: 'line', img: '/images/charts/line-on.png' },
  { type: 'area', img: '/images/charts/line-area-on.png' },
  { type: 'pie', img: '/images/charts/pie-on.png' },
];

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const PanelCharts = ({ chartType, chooseChart, ...others }: IProps) => (
  <Panel {...others} header="图表" key="charts">
    {charts.map(({ type, img }) => (
      <div
        key={type}
        className={classnames({ 'bi-drawer-charts': true, active: type === chartType })}
        onClick={() => chooseChart(type)}
      >
        <Tooltip placement="bottom" title={chartNameMap[type]}>
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
