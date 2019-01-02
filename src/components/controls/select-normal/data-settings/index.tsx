import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, pannelControlPrefix } from '../../../utils';

const { TextArea } = Input;

const DataSettings = ({ form }: FormComponentProps) => {
  const { getFieldDecorator } = form;
  return (
    <React.Fragment>
      <Form.Item label="控件接口" {...formItemLayout}>
        {getFieldDecorator(`${pannelControlPrefix}url`, {
          rules: [{
            message: '请输入接口',
          }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="固定数据" {...formItemLayout}>
        {
          getFieldDecorator(`${pannelControlPrefix}fixedData`, {
            rules: [{
              message: '请输入固定数据',
            }],
          })(<TextArea placeholder="示例：[{name: 'lucy', value: '1'}, {name: 'jack', value: '2'}]" />)
        }
      </Form.Item>
    </React.Fragment>
  );
};

export default DataSettings;
