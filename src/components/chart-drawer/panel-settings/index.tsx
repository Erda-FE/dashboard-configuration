import React from 'react';
import { Collapse } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import PanelToolTip from './panel-tooltip';

const { Panel } = Collapse;

type IProps = FormComponentProps;

const PanelSettings = ({ form, ...others }: IProps) => (
  <Panel {...others} header="配置" key="settings">
    <Collapse>
      <PanelToolTip form={form} />
    </Collapse>
  </Panel>
);

export default PanelSettings;
