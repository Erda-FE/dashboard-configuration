import React from 'react';
import { Collapse, Icon, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import PanelToolTip from './panel-tooltip';
import PanelLegend from './panel-legend';
import PanelTitle from './panel-title';
import PanelYAxis from './panel-yAxis';
import PanelXAxis from './panel-xAxis';
import './index.scss';

const { Panel } = Collapse;

type IProps = FormComponentProps;

const PanelSettings = ({ form, ...others }: IProps) => (
  <Panel
    {...others}
    key="settings"
    header={
      <div className="bi-panel-setting-header">
        <span>配置</span>
        <Tooltip placement="right" title="配置帮助">
          <a target="_blank" rel="noopener noreferrer" href="https://echarts.baidu.com/option.html">
            <Icon type="question-circle" />
          </a>
        </Tooltip>
      </div>
    }
  >
    <Collapse>
      <PanelTitle form={form} />
      <PanelToolTip form={form} />
      <PanelLegend form={form} />
      <PanelYAxis form={form} />
      <PanelXAxis form={form} />
    </Collapse>
  </Panel>
);

export default PanelSettings;
