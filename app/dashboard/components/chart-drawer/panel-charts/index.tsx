import React from 'react';
import { get } from 'lodash';
import classnames from 'classnames';
import { connect } from 'dva';
import { Collapse, Tooltip, Icon } from 'antd';
import { chartNameMap } from '../../../utils';
import './index.scss';

const { Panel } = Collapse;

const charts = [
  { type: 'bar' }, // img: '/images/charts/bar-heap-on.png'
  { type: 'line' }, // img: '/images/charts/line-on.png'
  { type: 'area' }, // img: '/images/charts/line-area-on.png'
  { type: 'pie' }, // img: '/images/charts/pie-on.png'
];

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const PanelCharts = ({ chartType, chooseChart, ...others }: IProps) => (
  <Panel {...others} header="图表" key="charts">
    {charts.map(({ type }) => (
      <div
        key={type}
        className={classnames({ 'bi-drawer-charts': true, active: type === chartType })}
        onClick={() => chooseChart(type)}
      >
        <Tooltip placement="bottom" title={chartNameMap[type]}>
          <Icon type={`${type}-chart`} />
        </Tooltip>
      </div>
    ))}
  </Panel>
);

const mapStateToProps = ({ biDrawer: { drawerInfoMap, editChartId } }: any) => ({
  chartType: get(drawerInfoMap, [editChartId, 'chartType']),
});

const mapDispatchToProps = (dispatch: any) => ({
  chooseChart(chartType: string) {
    dispatch({ type: 'biDrawer/chooseChart', chartType });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelCharts);
