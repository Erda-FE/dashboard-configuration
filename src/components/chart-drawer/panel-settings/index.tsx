import React from 'react';
import { Collapse, Icon, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import PanelToolTip from './panel-tooltip';
import CodeModal from './code-modal';
import PanelLegend from './panel-legend';
import PanelTitle from './panel-title';
import PanelYAxis from './panel-yAxis';
import PanelXAxis from './panel-xAxis';
import './index.scss';

const { Panel } = Collapse;

type IProps = FormComponentProps & ReturnType<typeof mapDispatchToProps>;

const PanelSettings = ({ form, openCodeModal, ...others }: IProps) => (
  <React.Fragment>
    <Panel
      {...others}
      key="settings"
      header={
        <div className="bi-in-a-icon">
          <span>配置</span>
          <Tooltip placement="bottom" title="Echarts配置帮助">
            <a target="_blank" rel="noopener noreferrer" href="https://echarts.baidu.com/option.html">
              <Icon type="question-circle" />
            </a>
          </Tooltip>
          <Tooltip placement="bottom" title="转为代码进行编辑">
            <Icon
              type="code"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                openCodeModal();
              }}
            />
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
    <CodeModal />
  </React.Fragment>
);

const mapDispatchToProps = (dispatch: any) => ({
  openCodeModal() {
    dispatch({ type: 'biDrawer/openCodeModal' });
  },
});

export default connect(undefined, mapDispatchToProps)(PanelSettings);