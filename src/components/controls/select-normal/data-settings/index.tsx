import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import PropTypes from 'prop-types';
import { formItemLayout, panelControlPrefix } from '../../../utils';
import { checkFixedData } from '../utils';

const { TextArea } = Input;

export default class DataSettings extends React.PureComponent<FormComponentProps> {
  static contextTypes = {
    UrlComponent: PropTypes.func,
  };

  validateFixedData = (rule: any, value: string, callback: Function) => {
    if (checkFixedData(value)) {
      callback();
    }
    callback('请输入合法的数据格式，示例 [{"name": "lucy", "value": 1}]');
  }

  render() {
    const { UrlComponent } = this.context;
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <Form.Item label="参数名称" {...formItemLayout}>
          {getFieldDecorator(`${panelControlPrefix}searchName`, {
            rules: [{
              required: true,
              message: '请输入在接口中的查询名称',
            }],
          })(<Input placeholder="请输入在接口中的查询名称，一般为英文，示例：id" />)}
        </Form.Item>
        <Form.Item label="控件接口" {...formItemLayout}>
          {getFieldDecorator(`${panelControlPrefix}url`, {
            rules: [{
              message: '请输入控件接口',
            }],
          })(<UrlComponent placeholder="请输入控件接口，用于动态获取控件数据" />)}
        </Form.Item>
        <Form.Item label="固定数据" {...formItemLayout}>
          {getFieldDecorator(`${panelControlPrefix}fixedData`, {
            rules: [{
              message: '请输入固定数据',
            }, {
              validator: this.validateFixedData,
            }],
          })(<TextArea placeholder={`${''}请输入标准JSON格式的固定数据，用于静态的控件数据，示例：[{"name": 'lucy', "value": 1}]`} />)}
        </Form.Item>
        <Form.Item label="多选" {...formItemLayout}>
          {getFieldDecorator(`${panelControlPrefix}multiple`, {
            valuePropName: 'checked',
            initialValue: false,
          })(<Checkbox />)}
        </Form.Item>
        <Form.Item label="搜索" {...formItemLayout}>
          {getFieldDecorator(`${panelControlPrefix}canSearch`, {
            valuePropName: 'checked',
            initialValue: false,
          })(<Checkbox />)}
        </Form.Item>
      </React.Fragment>
    );
  }
}
