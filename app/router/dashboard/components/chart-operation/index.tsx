import React from 'react';
import { connect } from 'dva';
import './index.scss';

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ChartOperation extends React.PureComponent<IProps> {
  render() {
    const { children } = this.props;
    return (
      <div className="bi-chart-operation">
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
  initDashboardType() {
    dispatch({ type: 'biDashBoard/initDashboardType', dashboardType: 'board' });
  },
  onLayoutChange(layout: []) {
    dispatch({ type: 'biDashBoard/onLayoutChange', layout });
  },
  openDrawer() {
    dispatch({ type: 'biDrawer/openDrawer' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartOperation);
