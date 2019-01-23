import React from 'react';
import { Collapse, Form, Input, Switch, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { panelSettingPrefix } from '../../../utils';
import { formPositionLayout } from '../utils';
import { funcValidator } from '../../../charts/utils';

const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;
const panelSettingXAxisPrefix = `${panelSettingPrefix}xAxis#`;

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
        rules: [{
          validator: funcValidator,
        }],
      })(<TextArea
        autosize
        placeholder="输入fomater函数. e.g.
        function(value){
            if(value > 1024) return value/1024 + 'MB';
            else return value + 'KB';
        }"
      />)}
    </Form.Item>
  </Panel >
);

export default PanelSettings;
