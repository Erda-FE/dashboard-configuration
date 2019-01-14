import React from 'react';
import { Collapse, Form, Switch, Radio } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { panelSettingPrefix } from '../../../utils';

const { Panel } = Collapse;

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
  </Panel >
);

export default PanelSettings;
