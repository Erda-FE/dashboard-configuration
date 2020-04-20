/**
 * 数据指标
 */
import './index.scss';

import { Icon } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { uniqueId, map } from 'lodash';

interface IResult {
  name?: string;
  unit?: string;
  value?: number | string;
  status?: string;
  color?: string;
}

interface IProps extends ReturnType<typeof mapStateToProps> {
  viewId: string
  results: IResult[];
}

const Metric = ({ results = [], viewId }: IProps) => (
  <React.Fragment>
    <section className="dc-metrics-panel">
      {
        map(results, ({ name, value, unit, status, color }) => (
          <div className="metric-item" key={uniqueId(viewId)}>
            <span className={`metric-value ${color ? `color-${color}` : ''}`}>
              {`${value || '--'}${unit || ''}`}
            </span>
            <span className="metric-name">{name || ''}</span>
          </div>
        ))
      }
    </section>
  </React.Fragment>);

const mapStateToProps = ({ chartEditor: { viewMap } }: any, { viewId, data: { metricData: results, proportion }, option }: any) => {
  const drawerInfo = viewMap[viewId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    results,
    option: { ...option, proportion },
  };
};

export default connect(mapStateToProps)(Metric);
