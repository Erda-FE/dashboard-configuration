/**
 * 公用的dataSettings
 */
import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { panelDataPrefix } from '../../utils';
import PropTypes from 'prop-types';

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
      <Form.Item label="接口" {...urlItemLayout}>
        {getFieldDecorator(`${panelDataPrefix}url`, {
          rules: [{
            message: '请输入接口',
          }],
        })(<UrlComponent placeholder="请输入接口，用于获取数据" chartid={editChartId} />)}
      </Form.Item>
    );
  }
}

const mapStateToProps = ({
  biDrawer: { editChartId },
}: any) => ({
  editChartId,
});

export default connect(mapStateToProps)(DataSettings);
