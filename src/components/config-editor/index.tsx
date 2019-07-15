import { Button, Form, message, Tabs, Popconfirm } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { find, forEach, get, isEmpty } from 'lodash';
import React from 'react';
import { getConfig } from '../../config';
import './index.scss';
import PanelControls from './panel-controls';
import PanelData from './panel-data';
import PanelCharts from './panel-views';

const { TabPane } = Tabs;

const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
};

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const noop = () => null;

class ChartDrawer extends React.PureComponent<IProps> {
  saveEditor = () => { // 可以提交图表或控件
    const { form: { validateFields }, saveEditor, view } = this.props;
    if (isEmpty(view)) {
      return;
    } else if (!view.viewType && !view.controlType) {
      message.error('请选择图表或者控件');
      return;
    }
    validateFields((err: any) => {
      if (err) return;
      saveEditor();
    });
  }

  render() {
    const { visible, view, closeEditor, form, addMode, deleteEditor, editViewId, form: { getFieldDecorator } } = this.props;
    if (!view) {
      return null;
    }
    const EditorContainer = getConfig('EditorContainer');
    const info = getConfig('chartsMap')[view.viewType];
    const { Configurator = noop } = info;
    return (
      <EditorContainer
        visible={visible}
        onClose={addMode ? deleteEditor : closeEditor}
        className="bi-config-editor"
      >
        <div className="bi-config-editor-content">
          <Form >
            <Form.Item key="viewType" label="展示类型" {...formItemLayout}>
              {getFieldDecorator('viewType', {
                rules: [{
                  required: true,
                  message: '请选择展示类型',
                }],
              })(<PanelCharts />)}
            </Form.Item>
            <Tabs defaultActiveKey="setting">
              <TabPane tab="配置" key="setting">
                <Configurator form={form} />
              </TabPane>
              <TabPane tab="数据" key="data">
                <PanelData form={form} />
              </TabPane>
              <TabPane tab="控件" key="control">
                <PanelControls form={form} />
              </TabPane>
            </Tabs>
          </Form>
        </div>
        <div className="bi-config-editor-footer">
          <div className="bi-config-editor-footer-left">
            {`图表ID: ${editViewId}`}
          </div>
          <div className="bi-config-editor-footer-right">
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="top"
              title="确认丢弃数据?"
              onConfirm={addMode ? deleteEditor : closeEditor}
            >
              <Button style={{ marginRight: 8 }}>
                取消
              </Button>
            </Popconfirm>
            <Button onClick={this.saveEditor} type="primary">
              {addMode ? '新增' : '保存'}
            </Button>
          </div>
        </div>
      </EditorContainer>
    );
  }
}

const mapStateToProps = ({
  biEditor: { visible, addMode, viewMap, editViewId },
}: any) => ({
  visible,
  editViewId,
  addMode,
  view: get(viewMap, [editViewId]),
});

const mapDispatchToProps = (dispatch: any) => ({
  deleteEditor() {
    dispatch({ type: 'biEditor/deleteEditor' });
  },
  closeEditor() {
    dispatch({ type: 'biEditor/closeEditor' });
  },
  saveEditor() {
    dispatch({ type: 'biEditor/saveEditor' });
  },
  onEditorChange(payload: object) {
    dispatch({ type: 'biEditor/updateState', payload: { tempView: payload } });
  },
});

let changedFields = {};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields({ view }: IProps) {
    const values = {};
    forEach(view, (value, key) => { values[key] = Form.createFormField({ ...changedFields[key], value }); });
    return values;
  },
  onFieldsChange(props: IProps, fields) {
    changedFields = fields;
  },
  onValuesChange({ onEditorChange }: IProps, _, allValues) {
    onEditorChange(allValues);
  },
})(ChartDrawer));
