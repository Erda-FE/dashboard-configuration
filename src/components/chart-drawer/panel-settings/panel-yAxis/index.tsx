import React from 'react';
import { Collapse, Form, Input, Switch } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, panelSettingPrefix } from '../../../utils';

const { Panel } = Collapse;
const panelSettingYAxisPrefix = `${panelSettingPrefix}yAxis#`;

export const formPositionLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

type IProps = FormComponentProps;

const PanelSettings = ({ form: { getFieldDecorator }, ...others }: IProps) => (
  <Panel {...others} header="yAxis" key="yAxis">
    <Form.Item label="show" {...formItemLayout}>
      {getFieldDecorator(`${panelSettingYAxisPrefix}show`, {
        initialValue: true,
        valuePropName: 'checked',
      })(<Switch />)}
    </Form.Item>
    <Form.Item label="type" {...formItemLayout}>
      {getFieldDecorator(`${panelSettingYAxisPrefix}type`, {
      })(<Input />)}
    </Form.Item>
    <Form.Item label="name" {...formItemLayout}>
      {getFieldDecorator(`${panelSettingYAxisPrefix}name`, {
      })(<Input />)}
    </Form.Item>
  </Panel >
);

export default PanelSettings;
