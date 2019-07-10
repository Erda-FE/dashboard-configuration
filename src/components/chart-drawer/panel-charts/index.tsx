import React from 'react';
import { get, map } from 'lodash';
import classnames from 'classnames';
import { connect } from 'dva';
import { Collapse, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import './index.scss';

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class PanelCharts extends React.PureComponent<IProps> {
  static contextTypes = {
    chartsMap: PropTypes.object,
  };

  render() {
    const { chartType, onChoose, ...others } = this.props;
    console.log('others:', others);
    return (
      <div>
        组件
        {map(this.context.chartsMap, ({ icon, name }, type) => (
          <div
            key={type}
            className={classnames({ 'bi-drawer-charts': true, active: type === chartType })}
            onClick={() => onChoose(type)}
          >
            <Tooltip placement="bottom" title={name}>
              {icon}
            </Tooltip>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = ({ biDrawer: { drawerInfoMap, editChartId } }: any) => ({
  chartType: get(drawerInfoMap, [editChartId, 'chartType']),
});

const mapDispatchToProps = (dispatch: any) => ({
  onChoose(chartType: string) {
    dispatch({ type: 'biDrawer/chooseChart', chartType });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelCharts);
