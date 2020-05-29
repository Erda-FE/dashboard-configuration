/**
 * 公用的dataSettings
 */
import React from 'react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { panelDataPrefix } from '../../../utils/constants';
import { funcValidator } from '../utils';
import EditorFrom from '../../editor-form';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';

interface IProps extends FormComponentProps {
  editChartId: string;
  contextMap: any;
}
class DataSettings extends React.PureComponent<IProps> {
  render() {
    const { editChartId, form: { getFieldDecorator }, contextMap } = this.props;
    const { getUrlComponent, urlItemLayout } = contextMap;
    const UrlComponent = getUrlComponent();
    return (
      <div>
        <Form.Item label="接口" {...urlItemLayout}>
          {getFieldDecorator(`${panelDataPrefix}url`, {
            rules: [{
              message: '请输入接口',
            }],
          })(<UrlComponent placeholder="请输入接口，用于获取数据" viewId={editChartId} />)}
        </Form.Item>
        <Form.Item label="转换函数" {...urlItemLayout}>
          {getFieldDecorator(`${panelDataPrefix}dataConvertor`, {
            rules: [{
              validator: funcValidator,
            }],
          })(<EditorFrom
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

export default (p: any) => {
  const editChartId = ChartEditorStore.useStore(s => s.editChartId);
  const contextMap = DashboardStore.useStore(s => s.contextMap);

  const storeProps = {
    contextMap,
    editChartId,
  };

  return <DataSettings {...storeProps} {...p} />;
};
