import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, pannelControlPrefix } from '../../../utils';

const { TextArea } = Input;

const DataSettings = ({ form }: FormComponentProps) => {
  const { getFieldDecorator } = form;
  return (
    <React.Fragment>
      <Form.Item label="参数名称" {...formItemLayout}>
        {getFieldDecorator(`${pannelControlPrefix}searchName`, {
          rules: [{
            required: true,
            message: '请输入在接口中的查询名称',
          }],
        })(<Input placeholder="请输入在接口中的查询名称，一般为英文，示例：id"/>)}
      </Form.Item>
      <Form.Item label="控件接口" {...formItemLayout}>
        {getFieldDecorator(`${pannelControlPrefix}url`, {
          rules: [{
            message: '请输入控件接口',
          }],
        })(<Input placeholder="请输入控件接口，用于动态获取控件数据"/>)}
      </Form.Item>
      <Form.Item label="固定数据" {...formItemLayout}>
        {getFieldDecorator(`${pannelControlPrefix}fixedData`, {
          rules: [{
            message: '请输入固定数据',
          }],
        })(<TextArea placeholder={`${''}请输入标准JSON格式的固定数据，用于静态的控件数据，示例：[{"name": 'lucy', "value": 1}]`} />)}
      </Form.Item>
    </React.Fragment>
  );
};

export default DataSettings;
