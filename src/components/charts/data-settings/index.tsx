/**
 * 公用的dataSettings
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { panelDataPrefix } from '../../utils';
import { convertFormatter } from '../utils';
import PropTypes from 'prop-types';

const { TextArea } = Input;

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps>;

class DataSettings extends React.PureComponent<IProps> {
  static contextTypes = {
    UrlComponent: PropTypes.func,
    urlItemLayout: PropTypes.object,
  };

  render() {
    const { UrlComponent, urlItemLayout } = this.context;
    const { editChartId, form: { getFieldDecorator } } = this.props;
    return (
      <div>
        <Form.Item label="接口" {...urlItemLayout}>
          {getFieldDecorator(`${panelDataPrefix}url`, {
            rules: [{
              message: '请输入接口',
            }],
          })(<UrlComponent placeholder="请输入接口，用于获取数据" chartid={editChartId} />)}
        </Form.Item>
        <Form.Item label="转换函数" {...urlItemLayout}>
          {getFieldDecorator(`${panelDataPrefix}dataConvertor`, {
            rules: [{
              validator: (_rule, value, callback) => {
                if (!value) {
                  callback();
                }
                const func = convertFormatter(value);
                if (typeof func === 'function') {
                  callback();
                } else {
                  callback('请输入正确函数体');
                }
              },
            }],
          })(<TextArea autosize
            placeholder="请输入完整转换函数,e.g.
            function(values) {
              if(!values.datas) {
                  return values;
              }
              let {names, datas} = values;
              datas = datas.map(v => {
                  let {name} = v;
                  if (name === 'demo1') {
                      v.name = '测试1';
                  }else if (name === 'demo2') {
                      v.name = '测试2';
                  }
                  return { ...v };
              });
              return {names, datas};
          }"
          />)}
        </Form.Item>
      </div>

    );
  }
}

const mapStateToProps = ({
  biDrawer: { editChartId },
}: any) => ({
  editChartId,
});

export default connect(mapStateToProps)(DataSettings);
