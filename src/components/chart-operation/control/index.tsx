import React from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import PropTypes from 'prop-types';

interface IProps extends ReturnType<typeof mapStateToProps> {
  chartId: string
  onConvert?: (resData: object, chartId: string, url: string) => object | Promise<any>
}

class Control extends React.PureComponent<IProps> {
  static contextTypes = {
    controlsMap: PropTypes.object,
  };

  render() {
    const { controlType } = this.props;
    const { component: Comp } = get(this.context.controlsMap, [controlType], {});
    return Comp ? <Comp /> : null;
  }
}

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId }: any) => ({
  controlType: get(drawerInfoMap, [chartId, 'controlType'], ''),
});

export default connect(mapStateToProps)(Control);
