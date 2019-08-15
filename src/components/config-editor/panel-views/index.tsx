import React from 'react';
import { get, map } from 'lodash';
import classnames from 'classnames';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import { getConfig } from '../../../config';
import './index.scss';

interface IProps {
  chartType: string
  onChoose(type: string): void
}

const PanelViews = ({ chartType, onChoose }: IProps) => {
  const customCharts = getConfig('customCharts');
  return (
    <div>
      {map(customCharts, ({ icon, name }, type) => (
        <div
          key={type}
          className={classnames({ 'bi-config-editor-views': true, active: type === chartType })}
          onClick={() => onChoose(type)}
        >
          <Tooltip placement="bottom" title={name}>
            {icon}
          </Tooltip>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = ({ chartEditor: { chartMap, editChartId } }: any) => ({
  chartType: get(chartMap, [editChartId, 'chartType'], ''),
});

const mapDispatchToProps = (dispatch: any) => ({
  onChoose(chartType: string) {
    dispatch({ type: 'chartEditor/chooseChartType', chartType });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelViews);
