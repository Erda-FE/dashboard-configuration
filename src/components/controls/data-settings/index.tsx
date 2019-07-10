/**
 * 公用的dataSettings
 */
import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { panelControlPrefix, positiveIntRegExp } from '~/utils/constants';
import { formItemLayout } from '~/utils/comp';

const DataSettings = ({ form }: FormComponentProps) => {
  const { getFieldDecorator } = form;
  return (
    <React.Fragment>
      <Form.Item label="控件宽度" {...formItemLayout}>
        {getFieldDecorator(`${panelControlPrefix}width`, {
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
      <Form.Item label="参数名称" {...formItemLayout}>
        {getFieldDecorator(`${panelControlPrefix}searchName`, {
          rules: [{
            required: true,
            message: '请输入在接口中的查询名称',
          }],
        })(<Input placeholder="请输入在接口中的查询名称，一般为英文，示例：id" />)}
      </Form.Item>
    </React.Fragment>
  );
};

export default DataSettings;
