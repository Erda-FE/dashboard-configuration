/**
 * 图表操作-控件读取
 */
import React from 'react';
import { map, isString, isEmpty } from 'lodash';
import { getConfig } from '../../../config';
import './index.scss';

interface IProps {
  viewId: string;
  view: {
    controls: any[];
    controlProps: any;
  };
  loadData: () => void;
}

class Control extends React.PureComponent<IProps> {
  static contextTypes = {
    controlsMap: {},
  };

  state = {
    query: {},
  };

  onControlChange = (query: any) => {
    this.setState({
      query: {
        // eslint-disable-next-line react/no-access-state-in-setstate
        ...this.state.query,
        ...query,
      },
    });
  };

  render() {
    const { view, viewId, loadData } = this.props;
    const controlList = map(view.controls, (ctr: string | React.ReactElement<any>) => (isString(ctr) ? getConfig(['ControlMap', ctr]) : ctr));
    const { controlProps = [] } = view;
    if (isEmpty(controlList)) {
      return null;
    }
    return (
      <div className="dc-view-control">
        {controlList.map((CtrComp: any, i) => {
          const ctrProps = controlProps[i] || {};
          // eslint-disable-next-line react/no-array-index-key
          return (<CtrComp key={i} viewId={viewId} query={this.state.query} onChange={this.onControlChange} loadData={loadData} {...ctrProps} />);
        })}
      </div>
    );
  }
}


export default Control;
