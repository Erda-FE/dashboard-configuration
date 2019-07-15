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
    Controls: any[]
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
    const ControlList = map(view.Controls, (ctr: any) => isString(ctr) ? getConfig(['ControlMap', ctr]) : ctr);
    if (isEmpty(ControlList)) {
      return null;
    }
    return (
      <div className="bi-view-control">
        {ControlList.map((Ctr, i) => <Ctr key={i} viewId={viewId} query={this.state.query} onChange={this.onControlChange} loadData={loadData} />)}
      </div>
    );
  }
}


export default Control;
