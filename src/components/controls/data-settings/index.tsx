/**
 * 公用的dataSettings
 */
import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, pannelControlPrefix, positiveIntRegExp } from '../../utils';

const DataSettings = ({ form }: FormComponentProps) => {
  const { getFieldDecorator } = form;
  return (
    <Form.Item label="控件宽度" {...formItemLayout}>
      {getFieldDecorator(`${pannelControlPrefix}width`, {
        initialValue: 120,
        rules: [{
          required: true,
          message: '请输入控件宽度',
        }, {
          pattern: positiveIntRegExp,
          message: '请输入正整数',
        }],
      })(<Input placeholder="请输入控件宽度" />)}
    </Form.Item>
  );
};

export default DataSettings;
