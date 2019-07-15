import React from 'react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout } from '../../../utils/comp';
import { panelSettingPrefix } from '../../../utils/constants';
import EdiotorFrom from '../../editor-form';

type IProps = FormComponentProps;

const panelSettingTooltipPrefix = `${panelSettingPrefix}tooltip#`;

const TooltipSetting = ({ form: { getFieldDecorator } }: IProps) => (
  <React.Fragment>
    <Form.Item label="formatter" {...formItemLayout}>
      {getFieldDecorator(`${panelSettingTooltipPrefix}formatter`, {
        rules: [{
          message: '请输入formatter, 正则或者es5函数',
        }],
      })(<EdiotorFrom height={80} placeholder="请输入formatter，示例：{a} <br/>{b}: {c} ({d})% 或 function(params) { return params[0].value; }" />)}
    </Form.Item>
  </React.Fragment>
);

export default TooltipSetting;
