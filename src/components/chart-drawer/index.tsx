import { forEach, get, find, isEmpty } from 'lodash';
import React from 'react';
import { connect } from 'dva';
import { Drawer, Button, Collapse, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import PanelCharts from './panel-charts';
import PanelControls from './panel-controls';
import PanelSettings from './panel-settings';
import PanelData from './panel-data';
import './index.scss';

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ChartDrawer extends React.PureComponent<IProps> {
  submitDrawer = () => {
    const { form: { validateFields }, submitDrawer, drawerInfo } = this.props;
    if (isEmpty(drawerInfo)) {
      return;
    }
    validateFields((err: any) => {
      if (err) return;
      submitDrawer();
    });
  }

  render() {
    const { visible, closeDrawer, form, isAdd, deleteDrawer, editChartId } = this.props;
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
            <Collapse defaultActiveKey={['charts']}>
              <PanelCharts />
              <PanelControls form={form} />
              <PanelSettings form={form} />
              <PanelData form={form} />
            </Collapse>
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields({ drawerInfo }: IProps) {
    const values = {};
    forEach(drawerInfo, (value, key) => { values[key] = Form.createFormField({ value }); });
    return values;
  },
  onValuesChange({ onDrawerChange }: IProps, _, allValues) {
    onDrawerChange(allValues);
  },
})(ChartDrawer));
