import React from 'react';
import { Collapse, Icon, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import PanelToolTip from './panel-tooltip';
import CodeModal from './code-modal';
import './index.scss';

const { Panel } = Collapse;

type IProps = FormComponentProps & ReturnType<typeof mapDispatchToProps>;

const PanelSettings = ({ form, openCodeModal, ...others }: IProps) => (
  <React.Fragment>
    <Panel
      {...others}
      key="settings"
      header={
        <div className="bi-panel-setting-header">
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
        <PanelToolTip form={form} />
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
