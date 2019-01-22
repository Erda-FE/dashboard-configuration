import React from 'react';
import { Collapse, Form, Input, Switch, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, panelSettingPrefix } from '../../../utils';

const { Panel } = Collapse;
const { TextArea } = Input;
const panelSettingTitlePrefix = `${panelSettingPrefix}title#`;

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
  <Panel {...others} header="title" key="title">
    <Form.Item label="show" {...formItemLayout}>
      {getFieldDecorator(`${panelSettingTitlePrefix}show`, {
        initialValue: false,
      })(<Switch />)}
    </Form.Item>
    <Form.Item label="text" {...formItemLayout}>
      {getFieldDecorator(`${panelSettingTitlePrefix}text`, {
      })(<TextArea />)}
    </Form.Item>
    <Row>
      <Col span={12}>
        <Form.Item label="top" {...formPositionLayout}>
          {getFieldDecorator(`${panelSettingTitlePrefix}top`, {
          })(<Input />)}
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="bottom" {...formPositionLayout}>
          {getFieldDecorator(`${panelSettingTitlePrefix}bottom`, {
          })(<Input />)}
        </Form.Item>
      </Col>
    </Row>
    <Row>
      <Col span={12}>
        <Form.Item label="left" {...formPositionLayout}>
          {getFieldDecorator(`${panelSettingTitlePrefix}left`, {
          })(<Input />)}
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="right" {...formPositionLayout}>
          {getFieldDecorator(`${panelSettingTitlePrefix}right`, {
          })(<Input />)}
        </Form.Item>
      </Col>
    </Row>
  </Panel >
);

export default PanelSettings;
