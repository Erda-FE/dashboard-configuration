/**
 * 图表操作-控件读取
 */
import React from 'react';
import { map, isString, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { getConfig } from '../../../../config';
import './index.scss';

interface IProps {
  viewId: string
  view: {
    controls: any[]
    controlProps: any;
  }
  loadData(): void
}

class Control extends React.PureComponent<IProps> {
  static contextTypes = {
    controlsMap: PropTypes.object,
  };

  state = {
    query: {},
  };

  onControlChange = (query: any) => {
    this.setState({
      query: {
        ...this.state.query,
        ...query,
      },
    });
  }

  render() {
    const { view, viewId, loadData } = this.props;
    const controlList = map(view.controls, (ctr: string | React.ReactElement<any>) => (isString(ctr) ? getConfig(['ControlMap', ctr]) : ctr));
    const { controlProps } = view;
    if (isEmpty(controlList)) {
      return null;
    }
    return (
      <div className="bi-view-control">
        {controlList.map((CtrComp: any, i) => <CtrComp key={i} viewId={viewId} query={this.state.query} onChange={this.onControlChange} loadData={loadData} {...controlProps[i]} />)}
      </div>
    );
  }
}


export default Control;
