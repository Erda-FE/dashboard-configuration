import React from 'react';
import { Collapse, Form, Input, Switch, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, panelSettingPrefix } from '../../../utils';

const { Panel } = Collapse;
const { Option } = Select;
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
        initialValue: 'value',
      })(
        <Select>
          <Option value="value">value</Option>
          <Option value="time">time</Option>
        </Select>
      )}
    </Form.Item>
    <Form.Item label="name" {...formItemLayout}>
      {getFieldDecorator(`${panelSettingYAxisPrefix}name`, {
      })(<Input />)}
    </Form.Item>
  </Panel >
);

export default PanelSettings;
