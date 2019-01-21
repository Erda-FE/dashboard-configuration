import React from 'react';
import { Collapse, Form, Input, Switch, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { panelSettingPrefix, tab } from '../../../utils';

const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;
const panelSettingYAxisPrefix = `${panelSettingPrefix}yAxis#`;

const formPositionLayout = {
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
    <Form.Item label="show" {...formPositionLayout}>
      {getFieldDecorator(`${panelSettingYAxisPrefix}show`, {
        initialValue: true,
        valuePropName: 'checked',
      })(<Switch />)}
    </Form.Item>
    <Form.Item label="type" {...formPositionLayout}>
      {getFieldDecorator(`${panelSettingYAxisPrefix}type`, {
        initialValue: 'value',
      })(
        <Select>
          <Option value="value">value</Option>
          <Option value="category">category</Option>
          <Option value="time">time</Option>
        </Select>
      )}
    </Form.Item>
    <Form.Item label="name" {...formPositionLayout}>
      {getFieldDecorator(`${panelSettingYAxisPrefix}name`, {
      })(<Input />)}
    </Form.Item>
    <Form.Item label="axisLabel.fomater" {...formPositionLayout}>
      {getFieldDecorator(`${panelSettingYAxisPrefix}axisLabel#formatter`, {
      })(<TextArea onKeyDown={tab} />)}
    </Form.Item>
  </Panel >
);

export default PanelSettings;
