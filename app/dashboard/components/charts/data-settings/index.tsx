/**
 * 公用的dataSettings
 */
import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, pannelDataPrefix } from '../utils';

const DataSettings = ({ form }: FormComponentProps) => {
  const { getFieldDecorator } = form;
  return (
    <Form.Item label="接口" {...formItemLayout}>
      {getFieldDecorator(`${pannelDataPrefix}url`, {
        rules: [{
          message: '请输入接口',
        }],
      })(<Input />)}
    </Form.Item>
  );
};

export default DataSettings;
