import React from 'react';
import { get, map } from 'lodash';
import { connect } from 'dva';
import { Collapse, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './index.scss';
const { Panel } = Collapse;

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class PanelControls extends React.PureComponent<IProps> {
  static contextTypes = {
    controlsMap: PropTypes.object,
  };

  render() {
    const { controlType, onChoose, ...others } = this.props;
    return (
      <Panel {...others} header="控件" key="controls">
        {map(this.context.controlsMap, ({ name, icon }, type) => (
          <div
            key={type}
            className={classnames({ 'bi-drawer-controls': true, active: type === controlType })}
            onClick={() => onChoose(type)}
          >
            <Tooltip placement="bottom" title={name}>
              {icon}
            </Tooltip>
          </div>
        ))}
      </Panel>
    );
  }
}

const mapStateToProps = ({ biDrawer: { drawerInfoMap, editChartId } }: any) => ({
  controlType: get(drawerInfoMap, [editChartId, 'controlType']),
});

const mapDispatchToProps = (dispatch: any) => ({
  onChoose(controlType: string) {
    dispatch({ type: 'biDrawer/chooseControl', controlType });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelControls);
