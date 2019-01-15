import React from 'react';
import { Collapse, Form, Switch, Radio, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { panelSettingPrefix } from '../../../utils';

const { Panel } = Collapse;
const { TextArea } = Input;
type IProps = FormComponentProps;
const { Group: RadioGroup } = Radio;
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

const jsonValidator = (_rule: any, value: any, callback: any) => {
  try {
    if (value) {
      JSON.parse(value);
    }
  } catch (error) {
    callback('Not able to parse legend json');
  }
  callback();
};

const PanelSettings = ({ form: { getFieldDecorator }, ...others }: IProps) => (
  <Panel {...others} header="legend" key="legend">
    <Form.Item label="启用legend" {...LegendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}enableLegend`, {
        initialValue: false,
      })(<Switch />)}
    </Form.Item>
    <Form.Item label="位置" {...LegendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}position`, {
        initialValue: 'bottom',
      })(
        <RadioGroup>
          <Radio value="top">顶部</Radio>
          <Radio value="bottom">底部</Radio>
        </RadioGroup>
      )}
    </Form.Item>
    <Form.Item label="标题对应" {...LegendFormItemLayout}>
      {getFieldDecorator(`${panelSettingLegendPrefix}legendMapping`, {
        initialValue: '',
        rules: [{
          message: '请输入正确的JSON对象',
          validator: jsonValidator,
        }],
      })(<TextArea placeholder='请输入JSON 如： {"demo1": "测试1", "demo2": "测试2"}' />)}
    </Form.Item>
  </Panel >
);

export default PanelSettings;
