import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, pannelDataPrefix } from '../../utils';

const { TextArea } = Input;

const DataSettings = ({ form }: FormComponentProps) => {
  const { getFieldDecorator } = form;
  return (
    <Form.Item label="栅格比例" {...formItemLayout}>
      {
        getFieldDecorator(`${pannelDataPrefix}proportion`, {
          rules: [{
            message: '请输入栅格比例',
          }, {
            validator: (rule, values, callback) => {
              if (values && values.length > 0) {
                try {
                  JSON.parse(values);
                  callback();
                } catch (error) {
                  callback('请输入正确二维数组， 如：[[1,1,1,1],[1,1]] ');
                }
              } else {
                callback();
              }
            },
          }],
        })(<TextArea placeholder="示例：[[1,1,1,1],[1,1]]" />)
      }
    </Form.Item>
  );
};

export default DataSettings;
