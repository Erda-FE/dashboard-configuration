import React from 'react';
import { Collapse, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, panelSettingPrefix } from '../../../utils';

const { Panel } = Collapse;
const { TextArea } = Input;

type IProps = FormComponentProps;

const panelSettingTooltipPrefix = `${panelSettingPrefix}tooltip#`;

const PanelSettings = ({ form: { getFieldDecorator }, ...others }: IProps) => (
  <Panel {...others} header="tooltip" key="tooltip">
    <Form.Item label="formatter" {...formItemLayout}>
      {getFieldDecorator(`${panelSettingTooltipPrefix}formatter`, {
        rules: [{
          message: '请输入formatter, 正则或者es5函数',
        }],
      })(<TextArea placeholder="请输入formatter，示例：{a} <br/>{b}: {c} ({d})% 或 function(params) { return params[0].value; }" />)}
    </Form.Item>
  </Panel>
);

export default PanelSettings;
