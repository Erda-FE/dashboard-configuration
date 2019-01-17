/**
 * 联动设置
 * 与chart-operation
 * 1、不进行多级联动
 * 2、已联动、被联动时不可被再次进行联动
 */
import React from 'react';
import { filter, isEmpty, get, reduce, forEach } from 'lodash';
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
    const { form: { validateFields }, updateLinkMap, closeLinkSetting, linkId } = this.props;
    validateFields((err: any, values) => {
      if (err) return;
      updateLinkMap(linkId, values);
      closeLinkSetting();
    });
  }

  render() {
    const { linkId, closeLinkSetting, drawerInfoMap, layout, form: { getFieldDecorator }, hasLinkedIds } = this.props;
    const otherCharts = filter(layout, ({ i }) => i !== linkId && !hasLinkedIds.includes(i));
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
  linkSetting: { linkId, linkMap },
  biDashBoard: { layout },
  biDrawer: { drawerInfoMap },
}: any) => ({
  linkId,
  layout,
  drawerInfoMap,
  linkInfo: get(linkMap, [linkId], {}),
  // 已经被非当前图表联动图表id
  hasLinkedIds: reduce(linkMap, (result: string[], linkInfo: object, chartId: string) => {
    if (chartId === linkId) {
      return result;
    }
    const ids: string[] = [];
    forEach(linkInfo, (value, key) => {
      if (value) {
        ids.push(key);
      }
    });
    return [...result, ...ids];
  }, []),
});

const mapDispatchToProps = (dispatch: any) => ({
  closeLinkSetting() {
    dispatch({ type: 'linkSetting/closeLinkSetting' });
  },
  updateLinkMap(linkId: string, values: object) {
    dispatch({ type: 'linkSetting/updateLinkMap', linkId, values });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields({ linkInfo }: IProps) {
    const values = {};
    forEach(linkInfo, (value, key) => { values[key] = Form.createFormField({ value }); });
    return values;
  },
})(LinkSettingModal));
