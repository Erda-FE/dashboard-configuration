/**
 * 删格化仪表盘
 */
import React from 'react';
import { connect } from 'dva';
import ReactGridLayout from 'react-grid-layout';
import sizeMe from 'react-sizeme';
import { ChartLine } from 'dashboard/components';
import { ISizeMe } from 'dashboard/types';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

type IProps = ISizeMe;

const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const datas = [{
  data: [820, 932, 901, 934, 1290, 1330, 1320],
}];
const layout = [
  { i: 'a', x: 0, y: 0, w: 1, h: 6 },
  { i: 'b', x: 1, y: 0, w: 3, h: 6, minW: 2, maxW: 4 },
  { i: 'c', x: 4, y: 0, w: 1, h: 6 },
];

class Board extends React.PureComponent<IProps> {
  onLayoutChange = () => {

  }

  render() {
    const { size: { width } } = this.props;
    return (
      <div>
        <ReactGridLayout
          autoSize
          layout={layout}
          cols={12}
          rowHeight={30}
          width={width}
          onLayoutChange={this.onLayoutChange}
        >
          <div key="a"><ChartLine names={names} datas={datas} /></div>
          <div key="b"><ChartLine names={names} datas={datas} /></div>
          <div key="c"><ChartLine names={names} datas={datas} /></div>
        </ReactGridLayout>
      </div>
    );
  }
}

export default sizeMe({ monitorHeight: true })(connect()(Board));
