/**
 * 公用的dataSettings
 */
import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, panelDataPrefix } from '../../utils';
import PropTypes from 'prop-types';

export default class DataSettings extends React.PureComponent<FormComponentProps> {
  static contextTypes = {
    UrlComponent: PropTypes.func
  };

  render() {
    const UrlComponent = this.context.UrlComponent;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form.Item label="接口" {...formItemLayout}>
        {getFieldDecorator(`${panelDataPrefix}url`, {
          rules: [{
            message: '请输入接口',
          }],
        })(<UrlComponent />)}
      </Form.Item>
    );
  }
}
