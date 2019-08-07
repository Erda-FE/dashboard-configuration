import React from 'react';
import { Icon, Tooltip } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import SettingTooltip from './setting-tooltip';
import CodeModal from './code-modal';
import SettingLegend from './setting-legend';
import SettingTitle from './setting-title';
import SettingYAxis from './setting-yAxis';
import SettingXAxis from './setting-xAxis';
import './index.scss';

type IProps = FormComponentProps & ReturnType<typeof mapDispatchToProps>;

const SettingPanel = ({ form, openCodeModal }: IProps) => (
  <React.Fragment>
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
    <div className="bi-ui-section-title">标题</div>
    <SettingTitle form={form} />
    <div className="bi-ui-section-title">提示</div>
    <SettingTooltip form={form} />
    <div className="bi-ui-section-title">图例</div>
    <SettingLegend form={form} />
    <div className="bi-ui-section-title">纵轴</div>
    <SettingYAxis form={form} />
    <div className="bi-ui-section-title">横轴</div>
    <SettingXAxis form={form} />
    <CodeModal />
  </React.Fragment>
);

const mapDispatchToProps = (dispatch: any) => ({
  openCodeModal() {
    dispatch({ type: 'chartEditor/openCodeModal' });
  },
});

export default connect(undefined, mapDispatchToProps)(SettingPanel);
