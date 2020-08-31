// 切换图表类型
import React from 'react';
import { get, map, pick } from 'lodash';
import classnames from 'classnames';
import { Tooltip } from 'antd';
import { getConfig } from '../../../config';
import ChartEditorStore from '../../../stores/chart-editor';

import './index.scss';

interface IProps {
  chartType: string
  onChoose(type: string): void
}

const PanelViews = ({ chartType, onChoose }: IProps) => {
  const chartConfigMap = getConfig('chartConfigMap');
  return (
    <div className="dc-editor-view-list-wrapper">
      {map(
        pick(chartConfigMap, ['chart:line', 'chart:area', 'chart:bar']),
        ({ icon, name }, type) => (
          <div
            key={type}
            className={
            classnames({
              'dc-editor-view-list': true,
              active: type === chartType,
            })
          }
            onClick={() => onChoose(type)}
          >
            <Tooltip placement="bottom" title={name}>
              {icon}
            </Tooltip>
          </div>
        )
      )}
    </div>
  );
};

export default (p: any) => {
  const [viewMap, editChartId] = ChartEditorStore.useStore(s => [s.viewMap, s.editChartId]);
  const { chooseChartType } = ChartEditorStore;
  const props = {
    chartType: get(viewMap, [editChartId, 'chartType'], ''),
    onChoose: chooseChartType,
  };
  return <PanelViews {...props} {...p} />;
};
