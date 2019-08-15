import React from 'react';
import { get, map } from 'lodash';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/lib/form';
import { pretty } from 'js-object-pretty-print';
import PropTypes from 'prop-types';
import './index.scss';

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class PanelData extends React.Component<IProps> {
  static contextTypes = {
    customCharts: PropTypes.object,
  };

  render() {
    const { chartType, chooseChart, form } = this.props;
    const { name, mockData, dataSettings } = get(this.context.customCharts, [chartType], {});
    return (
      <React.Fragment>
        {chartType && (
          <a
            className="bi-demo-text"
            download={`mock-${chartType}.json`}
            href={`data:text/json;charset=utf-8,${pretty(mockData, 4, 'JSON', true)}`}
          >{`${name}数据示例下载`}
          </a>
        )}
        {map(dataSettings, (Setting, i) => <Setting form={form} key={i} />)}
      </React.Fragment>
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
