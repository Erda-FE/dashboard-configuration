import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, pannelDataPrefix } from '../../utils';

const { TextArea } = Input;

const DataSettings = ({ form }: FormComponentProps) => {
  const { getFieldDecorator } = form;
  return (
    <React.Fragment>
      <Form.Item label="栅格比例" {...formItemLayout}>
        {
          getFieldDecorator(`${pannelDataPrefix}proportion`, {
            rules: [{
              message: '请输入栅格比例',
            }],
          })(<TextArea placeholder="示例：[[1,1,1,1],[1,1]]" />)
        }
      </Form.Item>
    </React.Fragment>
  );
};

export default DataSettings;
