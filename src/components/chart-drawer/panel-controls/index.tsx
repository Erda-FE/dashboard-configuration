import React from 'react';
import { get, map } from 'lodash';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './index.scss';

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class PanelControls extends React.PureComponent<IProps> {
  static contextTypes = {
    controlsMap: PropTypes.object,
  };

  render() {
    const { controlType, onChoose, form } = this.props;
    const { dataSettings } = get(this.context.controlsMap, [controlType], {});
    return (
      <div>
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
        {map(dataSettings, (Setting, i) => <Setting form={form} key={i} />)}
      </div>
    );
  }
}

const mapStateToProps = ({ biDrawer: { drawerInfoMap, editChartId } }: any) => ({
  controlType: get(drawerInfoMap, [editChartId, 'controlType'], ''),
});

const mapDispatchToProps = (dispatch: any) => ({
  onChoose(controlType: string) {
    dispatch({ type: 'biDrawer/chooseControl', controlType });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(PanelControls);
