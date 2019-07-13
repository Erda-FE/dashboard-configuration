/**
 * 联动设置
 * 1、不进行多级联动
 * 2、已联动、被联动时不可被再次进行联动
 * 3、独立的控件可以联动独立的控件或图表，但图表不能联动独立的控件
 */
import React from 'react';
import { filter, isEmpty, get, reduce, forEach, groupBy } from 'lodash';
import { connect } from 'dva';
import { Modal, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import './index.scss';

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
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

  renderList = (list: any, label: React.ReactElement<any>) => {
    const { viewMap, form: { getFieldDecorator } } = this.props;
    return (
      <div>
        <div>{label}</div>
        {list.map(({ i }: any) => {
          const key = i as string;
          return (
            <Form.Item key={key} label={get(viewMap, [key, 'name'], key)} {...formItemLayout}>
              {getFieldDecorator(key, {
                rules: [{
                  message: '请输入联动参数的名称，一般为英文',
                }],
              })(<Input placeholder="请输入联动参数的名称，一般为英文" />)}
            </Form.Item>
          );
        })}
      </div>
    );
  }

  render() {
    const { linkId, closeLinkSetting, viewMap, layout, hasLinkedIds } = this.props;
    const otherCharts = filter(layout, ({ i }) => i !== linkId && !hasLinkedIds.includes(i));
    const settingMap = groupBy(otherCharts, ({ i }) => {
      if (viewMap[i].viewType) return 'chart';
      return 'control';
    });
    const currentName = get(viewMap, [linkId, 'name'], linkId);
    const isviewType = !!get(viewMap, [linkId, 'viewType'], linkId);
    const controlList = isviewType ? [] : get(settingMap, 'control', []);
    const chartList = get(settingMap, 'chart', []);
    const visible = !!linkId;
    return (
      <Modal
        title="联动设置"
        visible={visible}
        onOk={this.onOk}
        onCancel={closeLinkSetting}
        okText="保存"
        cancelText="取消"
        maskClosable={false}
      >
        {(isEmpty(controlList) && isEmpty(chartList)) || !visible ? '无可联动图表或者控件' : (
          <React.Fragment>
            {isEmpty(controlList) ? null : this.renderList(controlList, <span>请选择需要与<span className="bi-link-name">{currentName}</span>联动的控件</span>)}
            {isEmpty(chartList) ? null : this.renderList(chartList, <span>请选择需要与<span className="bi-link-name">{currentName}</span>联动的图表</span>)}
          </React.Fragment>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = ({
  linkSetting: { linkId, linkMap },
  biDashBoard: { layout },
  biEditor: { viewMap },
}: any) => ({
  linkId,
  layout,
  viewMap,
  linkInfo: get(linkMap, [linkId], {}),
  // 已经被非当前图表/控件  联动的 图表/控件id
  hasLinkedIds: reduce(linkMap, (result: string[], linkInfo: object, viewId: string) => {
    if (viewId === linkId) {
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
