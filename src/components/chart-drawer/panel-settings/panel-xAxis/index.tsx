import React from 'react';
import { Collapse, Form, Input, Switch, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { panelSettingPrefix, tab } from '../../../utils';

const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;
const panelSettingXAxisPrefix = `${panelSettingPrefix}xAxis#`;

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
  <Panel {...others} header="xAxis" key="xAxis">
    <Form.Item label="show" {...formPositionLayout}>
      {getFieldDecorator(`${panelSettingXAxisPrefix}show`, {
        initialValue: true,
        valuePropName: 'checked',
      })(<Switch />)}
    </Form.Item>
    <Form.Item label="type" {...formPositionLayout}>
      {getFieldDecorator(`${panelSettingXAxisPrefix}type`, {
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
      {getFieldDecorator(`${panelSettingXAxisPrefix}name`, {
      })(<Input />)}
    </Form.Item>
    <Form.Item label="axisLabel.fomater" {...formPositionLayout}>
      {getFieldDecorator(`${panelSettingXAxisPrefix}axisLabel#formatter`, {
      })(<TextArea onKeyDown={tab}
        autosize
        placeholder="输入fomater的函数体，参数预定义为value. e.g.
        if(value > 1024) return value/1024 + 'MB';
        else return value + 'KB';"
      />)}
    </Form.Item>
  </Panel >
);

export default PanelSettings;
