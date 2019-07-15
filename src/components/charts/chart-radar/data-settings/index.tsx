import React from 'react';
import { Form, Input, Icon, Row, Col, InputNumber } from 'antd';
import { isEqual, max, toNumber } from 'lodash';
import { FormComponentProps } from 'antd/lib/form';
import { panelDataPrefix } from '../../../../utils/constants';

import './index.scss';

type IProps = FormComponentProps;

class DataSettings extends React.PureComponent<IProps> {
  add = () => {
    const { form } = this.props;
    const keys: string[][] = form.getFieldValue('radarKeys');
    let id = 1;
    if (keys.length > 0) {
      id = max(keys.map((x: string[]) => toNumber(x[0].slice(-1)))) || 0;
      id += 1;
    }
    const nextKeys = [...keys, [`radarConfigKey${id}`, `radarConfigMax${id}`]];
    // important! notify form to detect changes
    form.setFieldsValue({
      radarKeys: nextKeys,
    });
  }

  remove = (k: string[]) => {
    const { form } = this.props;
    const keys = form.getFieldValue('radarKeys');
    // We need at least one
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      radarKeys: keys.filter((key: string) => !isEqual(k, key)),
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('radarKeys', { initialValue: [] });
    const keys = getFieldValue('radarKeys');
    return (
      <React.Fragment>
        <div className="bi-radar-settings-title">
          <Row>
            <Col span={4}><label>指标配置</label><Icon type="plus-circle" onClick={this.add} /></Col>
          </Row>
        </div>
        {keys.map((config: string[], i: number) => {
          const [configKey, configMax] = config;
          return (
            <Row key={configKey} className="bi-radar-settings-row">
              <Col className="bi-radar-settings-label" span={5}>
                <label>指标{i + 1}</label>
              </Col>
              <Col span={9}>
                <Form.Item style={{ display: 'inline-block' }} >
                  {
                    getFieldDecorator(`${panelDataPrefix}${configKey}`, {
                      rules: [{
                        message: '请输入指标配置名称',
                        required: true,
                      }],
                    })(<Input placeholder="示例：市场" />)
                  }
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item style={{ display: 'inline-block' }} >
                  {
                    getFieldDecorator(`${panelDataPrefix}${configMax}`, {
                      rules: [{
                        message: '请输入指标最大值',
                        required: true,
                        type: 'integer',
                      }],
                    })(<InputNumber style={{ width: '100%' }} min={1} placeholder="示例：3600" />)
                  }
                </Form.Item>
              </Col>
              <Col span={1} style={{ lineHeight: '39px', paddingLeft: '10px' }}>
                <Icon type="minus-circle-o" onClick={() => this.remove([configKey, configMax])} />
              </Col>
            </Row>);
        })}
      </React.Fragment>
    );
  }
}

export default DataSettings;
