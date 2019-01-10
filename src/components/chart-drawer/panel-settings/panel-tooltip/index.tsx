import React from 'react';
import { connect } from 'dva';
import { Collapse, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, pannelSettingPrefix } from '../../../utils';

const { Panel } = Collapse;
const { TextArea } = Input;

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const pannelSettingTooltipPrefix = `${pannelSettingPrefix}tooltip#`;

const PanelSettings = ({ visible, chooseChart, form: { getFieldDecorator }, ...others }: IProps) => (
  <Panel {...others} header="tooltip" key="tooltip">
    <Form.Item label="formatter" {...formItemLayout}>
      {getFieldDecorator(`${pannelSettingTooltipPrefix}formatter`, {
        rules: [{
          message: '请输入formatter',
        }],
      })(<TextArea placeholder="请输入formatter，示例：{a} <br/>{b}: {c} ({d})%" />)}
    </Form.Item>
  </Panel>
);

const mapStateToProps = ({ biDrawer: { visible } }: any) => ({
  visible,
});

const mapDispatchToProps = (dispatch: any) => ({
  chooseChart() {
    dispatch({ type: 'biDrawer/chooseChart' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelSettings);
