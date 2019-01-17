import React from 'react';
import { Collapse, Form, Switch, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { panelSettingPrefix } from '../../../utils';
import { checkFixedData } from '../../../controls/select-normal/utils';

const { Panel } = Collapse;
const { TextArea } = Input;
type IProps = FormComponentProps;
const panelSettingLegendPrefix = `${panelSettingPrefix}legend#`;
const LegendFormItemLayout =
  {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };

const PanelSettings = ({ form: { getFieldDecorator }, ...others }: IProps) => (
  <Panel {...others} header="legend" key="legend">
    <Form.Item label="show" {...LegendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}show`, {
        initialValue: false,
      })(<Switch />)}
    </Form.Item>
    <Form.Item label="top" {...LegendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}top`, {
      })(<Input />)}
    </Form.Item>
    <Form.Item label="left" {...LegendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}left`, {
      })(<Input />)}
    </Form.Item>
    <Form.Item label="right" {...LegendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}right`, {
      })(<Input />)}
    </Form.Item>
    <Form.Item label="bottom" {...LegendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}bottom`, {
      })(<Input />)}
    </Form.Item>
    <Form.Item label="标题对应" {...LegendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}legendMapping`, {
        initialValue: '',
        rules: [{
          message: '请输入正确的JSON对象字符串',
          validator: checkFixedData,
        }],
      })(<TextArea placeholder='请输入JSON 如： {"demo1": "测试1", "demo2": "测试2"}' />)}
    </Form.Item>
  </Panel >
);

export default PanelSettings;
