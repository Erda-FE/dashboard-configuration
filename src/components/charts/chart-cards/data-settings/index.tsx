import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, pannelDataPrefix } from '../../utils';

const { TextArea } = Input;
const errorMessage = '请输入正确二维数组， 如：[[1,1,1,1],[1,1]]';

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
                  const inputArray = JSON.parse(values);
                  if (Array.isArray(inputArray) && inputArray.length > 0 && inputArray.every(arr => Array.isArray(arr))) {
                    callback();
                  } else {
                    callback(errorMessage);
                  }
                } catch (error) {
                  callback(errorMessage);
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
