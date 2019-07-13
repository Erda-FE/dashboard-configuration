import React from 'react';
import { Form, Input, Switch, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout } from '~/utils/comp';
import { panelSettingPrefix } from '~/utils/constants';
import { formPositionLayout } from './utils';

const { TextArea } = Input;
const panelSettingTitlePrefix = `${panelSettingPrefix}title#`;

type IProps = FormComponentProps;

const SettingTitle = ({ form: { getFieldDecorator } }: IProps) => (
  <React.Fragment>
    <Form.Item label="show" {...formItemLayout}>
      {getFieldDecorator(`${panelSettingTitlePrefix}show`, {
        initialValue: false,
        valuePropName: 'checked',
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
  </React.Fragment>
);

export default SettingTitle;
