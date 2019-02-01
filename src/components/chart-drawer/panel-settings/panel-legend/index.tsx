import React from 'react';
import { Collapse, Form, Switch, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { panelSettingPrefix, plainArrayValidator } from '../../../utils';

import EditorForm from '../../../editor-form';

const { Panel } = Collapse;
type IProps = FormComponentProps;
const panelSettingLegendPrefix = `${panelSettingPrefix}legend#`;
const legendFormItemLayout =
  {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 12,
    },
  };

const PanelSettings = ({ form: { getFieldDecorator }, ...others }: IProps) => (
  <Panel {...others} header="legend" key="legend">
    <Form.Item label="show" {...legendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}show`, {
        initialValue: false,
        valuePropName: 'checked',
      })(<Switch />)}
    </Form.Item>
    <Form.Item label="top" {...legendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}top`, {
      })(<Input />)}
    </Form.Item>
    <Form.Item label="left" {...legendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}left`, {
      })(<Input />)}
    </Form.Item>
    <Form.Item label="right" {...legendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}right`, {
      })(<Input />)}
    </Form.Item>
    <Form.Item label="bottom" {...legendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}bottom`, {
      })(<Input />)}
    </Form.Item>
    <Form.Item label="标题对应" {...legendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}data`, {
        initialValue: '',
        rules: [{
          message: '请输入正确的JSON对象字符串',
          validator: plainArrayValidator,
        }],
      })(<EditorForm placeholder='请输入字符串数组 如： ["demo1", "demo2"]' />)}
    </Form.Item>
  </Panel >
);

export default PanelSettings;
