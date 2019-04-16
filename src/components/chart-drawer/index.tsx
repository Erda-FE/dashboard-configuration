import { forEach, get, find, isEmpty } from 'lodash';
import React from 'react';
import { connect } from 'dva';
import { Drawer, Button, Collapse, Form, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import PanelCharts from './panel-charts';
import PanelControls from './panel-controls';
import PanelSettings from './panel-settings';
import PanelData from './panel-data';
import './index.scss';

const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
};
const { TextArea } = Input;

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ChartDrawer extends React.PureComponent<IProps> {
  submitDrawer = () => { // 可以提交图表或控件
    const { form: { validateFields }, submitDrawer, drawerInfo } = this.props;
    if (isEmpty(drawerInfo)) {
      return;
    } else if (!drawerInfo.chartType && !drawerInfo.controlType) {
      message.error('请选择图表或者控件');
      return;
    }
    validateFields((err: any) => {
      if (err) return;
      submitDrawer();
    });
  }

  render() {
    const { visible, closeDrawer, form, isAdd, deleteDrawer, editChartId, form: { getFieldDecorator } } = this.props;
    return (
      <Drawer
        placement="right"
        visible={visible}
        width={500}
        onClose={closeDrawer}
        mask={false}
        closable={false}
        className="bi-drawer"
      >
        <div className="bi-drawer-content">
          <Form >
            <Form.Item key="name" label="名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入名称',
                }],
              })(<Input placeholder="请输入名称" />)}
            </Form.Item>
            <Collapse defaultActiveKey={['charts']}>
              <PanelCharts />
              <PanelControls form={form} />
              <PanelSettings form={form} />
              <PanelData form={form} />
            </Collapse>
            <Form.Item label="备注" {...formItemLayout}>
              {getFieldDecorator('remarks', {
                rules: [{
                  message: '可以备注一些关键信息',
                }],
              })(<TextArea placeholder="可以备注一些关键信息" style={{ marginTop: 12 }} />)}
            </Form.Item>
          </Form>
        </div>
        <div className="bi-drawer-footer">
          <div className="bi-drawer-footer-left">
            {`图表ID: ${editChartId}`}
          </div>
          <div className="bi-drawer-footer-right">
            <Button onClick={isAdd ? closeDrawer : deleteDrawer} style={{ marginRight: 8 }}>
              {isAdd ? '取消' : '删除'}
            </Button>
            <Button onClick={this.submitDrawer} type="primary">
              {isAdd ? '新增' : '保存'}
            </Button>
          </div>
        </div>
      </Drawer>
    );
  }
}

const mapStateToProps = ({
  biDrawer: { visible, drawerInfoMap, editChartId },
  biDashBoard: { layout },
}: any) => ({
  visible,
  editChartId,
  drawerInfo: get(drawerInfoMap, [editChartId]),
  isAdd: !find(layout, ({ i }) => i === editChartId),
});

const mapDispatchToProps = (dispatch: any) => ({
  deleteDrawer() {
    dispatch({ type: 'biDrawer/deleteDrawer' });
  },
  closeDrawer() {
    dispatch({ type: 'biDrawer/closeDrawer' });
  },
  submitDrawer() {
    dispatch({ type: 'biDrawer/submitDrawer' });
  },
  onDrawerChange(payload: object) {
    dispatch({ type: 'biDrawer/onDrawerChange', payload });
  },
});

let changedFields = {};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields({ drawerInfo }: IProps) {
    const values = {};
    forEach(drawerInfo, (value, key) => { values[key] = Form.createFormField({ ...changedFields[key], value }); });
    return values;
  },
  onFieldsChange(props: IProps, fields) {
    changedFields = fields;
  },
  onValuesChange({ onDrawerChange }: IProps, _, allValues) {
    onDrawerChange(allValues);
  },
})(ChartDrawer));
