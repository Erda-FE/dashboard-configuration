import { forEach, get } from 'lodash';
import React from 'react';
import { connect } from 'dva';
import { Drawer, Button, Collapse, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import PanelCharts from './panel-charts';
import PanelControls from './panel-controls';
import PanelStyles from './panel-styles';
import PanelData from './panel-data';
import './index.scss';

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ChartDrawer extends React.PureComponent<IProps> {
  submitDrawer = () => {
    const { form: { validateFields }, submitDrawer } = this.props;
    validateFields((err: any) => {
      if (err) return;
      submitDrawer();
    });
  }

  render() {
    const { visible, closeDrawer, form } = this.props;
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
              <PanelControls />
              <PanelStyles />
              <PanelData form={form} />
            </Collapse>
          </Form>
        </div>
        <div className="bi-drawer-footer">
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            关闭
          </Button>
          <Button onClick={this.submitDrawer} type="primary">
            保存
          </Button>
        </div>
      </Drawer>
    );
  }
}

const mapStateToProps = ({ biDrawer: { visible, drawerInfoMap, editChartId } }: any) => ({
  visible,
  drawerInfo: get(drawerInfoMap, [editChartId]),
});

const mapDispatchToProps = (dispatch: any) => ({
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
