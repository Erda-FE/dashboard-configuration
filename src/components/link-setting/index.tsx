/**
 * 联动设置
 */
import React from 'react';
import { filter, isEmpty, get } from 'lodash';
import { connect } from 'dva';
import { Modal, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export const formItemLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};

class LinkSettingModal extends React.PureComponent<IProps> {
  onOk = () => {
    const { form: { validateFields } } = this.props;
    validateFields((err: any, values) => {
      if (err) return;
      console.log('values', values);
    });
  }

  render() {
    const { linkId, closeLinkSetting, drawerInfoMap, layout, form: { getFieldDecorator } } = this.props;
    const otherCharts = filter(layout, ({ i }) => i !== linkId);
    return (
      <Modal
        title="联动设置"
        visible={!!linkId}
        onOk={this.onOk}
        onCancel={closeLinkSetting}
        okText="保存"
        cancelText="取消"
        maskClosable={false}
      >
        {isEmpty(otherCharts) ? '无可联动图表' : otherCharts.map(({ i }: any) => {
          const key = i as string;
          return (
            <Form.Item key={key} label={get(drawerInfoMap, [key, 'name'], key)} {...formItemLayout}>
              {getFieldDecorator(key, {
                rules: [{
                  message: '请输入联动参数名称，一般为英文',
                }],
              })(<Input placeholder="请输入联动参数名称，一般为英文" />)}
            </Form.Item>
          );
        })}
      </Modal>
    );
  }
}

const mapStateToProps = ({
  linkSetting: { linkId },
  biDashBoard: { layout },
  biDrawer: { drawerInfoMap },
}: any) => ({
  linkId,
  layout,
  drawerInfoMap,
});

const mapDispatchToProps = (dispatch: any) => ({
  closeLinkSetting() {
    dispatch({ type: 'linkSetting/closeLinkSetting' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(LinkSettingModal));
