import React from 'react';
import { connect } from 'dva';
import { Collapse, Popover } from 'antd';
import { chartNameMap } from 'dashboard/utils';
import './index.scss';

const { Panel } = Collapse;

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const DemoData = ({ chartType }: any) => (
  <div>
    <p>{chartType}</p>
  </div>
);

const PanelData = ({ chartType, chooseChart, ...others }: IProps) => (
  <Panel {...others} header="数据" key="data">
    {chartType && (
      <Popover
        placement="left"
        title={chartNameMap[chartType]}
        content={<DemoData chartType={chartType} />}
      >
        <div className="bi-demo-text">数据示例</div>
      </Popover>
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
