import React from 'react';
import { get, map } from 'lodash';
import { connect } from 'dva';
import { Collapse, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import jsonPretty from 'json-stringify-pretty-compact';
import PropTypes from 'prop-types';
import './index.scss';

const { Panel } = Collapse;

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class PanelData extends React.Component<IProps> {
  static contextTypes = {
    chartsMap: PropTypes.object,
  };

  render() {
    const { chartType, chooseChart, form, ...others } = this.props;
    const { name, mockData, dataSettings } = get(this.context.chartsMap, [chartType], {});
    return (
      <Panel {...others} header="数据" key="data">
        {chartType && (
          <a
            className="bi-demo-text"
            download={`mock-${chartType}.json`}
            href={`data:text/json;charset=utf-8,${jsonPretty(mockData)}`}
          >{`${name}数据示例下载`}
          </a>
        )}
        {map(dataSettings, (Setting, i) => <Setting form={form} key={i} />)}
      </Panel>
    );
  }
}

const mapStateToProps = ({ biDrawer: { drawerInfoMap, editChartId } }: any) => ({
  chartType: get(drawerInfoMap, [editChartId, 'chartType'], ''),
});

const mapDispatchToProps = (dispatch: any) => ({
  chooseChart() {
    dispatch({ type: 'biDrawer/chooseChart' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelData);
