import React from 'react';
import { Collapse, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, pannelSettingPrefix } from '../../../utils';

const { Panel } = Collapse;
const { TextArea } = Input;

type IProps = FormComponentProps;

const pannelSettingTooltipPrefix = `${pannelSettingPrefix}tooltip#`;

const PanelSettings = ({ form: { getFieldDecorator }, ...others }: IProps) => (
  <Panel {...others} header="tooltip" key="tooltip">
    <Form.Item label="formatter" {...formItemLayout}>
      {getFieldDecorator(`${pannelSettingTooltipPrefix}formatter`, {
        rules: [{
          message: '请输入formatter',
        }],
      })(<TextArea placeholder="请输入formatter，示例：{a} <br/>{b}: {c} ({d})%" />)}
    </Form.Item>
  </Panel>
);

export default PanelSettings;
