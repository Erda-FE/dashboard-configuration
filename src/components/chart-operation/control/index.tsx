/**
 * 图表操作-控件读取
 */
import React from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import PropTypes from 'prop-types';

interface IProps extends ReturnType<typeof mapStateToProps> {
  chartId: string
  onChange: (...args: any) => void | Promise<any>
}

class Control extends React.PureComponent<IProps> {
  static contextTypes = {
    controlsMap: PropTypes.object,
  };

  render() {
    const { controlType, ...others } = this.props;
    const { component: Comp } = get(this.context.controlsMap, [controlType], {});
    return Comp ? <Comp {...others} /> : null;
  }
}

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId }: any) => ({
  controlType: get(drawerInfoMap, [chartId, 'controlType'], ''),
});

export default connect(mapStateToProps)(Control);
