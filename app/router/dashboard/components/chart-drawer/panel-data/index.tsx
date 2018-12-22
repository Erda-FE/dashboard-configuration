import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { chartNameMap } from 'dashboard/utils';
import { getMockData } from './utils';
import './index.scss';

const { Panel } = Collapse;

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const PanelData = ({ chartType, chooseChart, ...others }: IProps) => (
  <Panel {...others} header="数据" key="data">
    {chartType && (
      <a
        className="bi-demo-text"
        download={`mock-${chartType}.json`}
        href={`data:text/json;charset=utf-8,${JSON.stringify(getMockData(chartType))}`}
      >{`${chartNameMap[chartType]}数据示例下载`}</a>
    )}
  </Panel>
);

const mapStateToProps = ({ biDrawer: { chartType } }: any) => ({
  chartType,
});

const mapDispatchToProps = (dispatch: any) => ({
  chooseChart() {
    dispatch({ type: 'biDrawer/chooseChart' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelData);
