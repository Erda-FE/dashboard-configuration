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
  const chartConfigMap = getConfig('chartConfigMap');
  return (
    <div>
      {map(chartConfigMap, ({ icon, name }, type) => (
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

const mapStateToProps = ({ chartEditor: { viewMap, editChartId } }: any) => ({
  chartType: get(viewMap, [editChartId, 'chartType'], ''),
});

const mapDispatchToProps = (dispatch: any) => ({
  onChoose(chartType: string) {
    dispatch({ type: 'chartEditor/chooseChartType', chartType });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelViews);
