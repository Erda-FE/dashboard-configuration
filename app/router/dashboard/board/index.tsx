/**
 * 删格化仪表盘
 * 1、阻止拖动是通过onDragStart来实现而非isDraggable
 * 2、阻止缩放，是通过隐藏样式，而非isResizable
 * 因为react-grid-layout会在相关变化时子组件注销重新加载，从而导致图表重绘操作，
 * 见GridItem相关实现即知,https://github.com/STRML/react-grid-layout/blob/master/lib/GridItem.jsx
 */
import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import ReactGridLayout from 'react-grid-layout';
import sizeMe from 'react-sizeme';
import { ChartLine } from 'dashboard/components';
import { ISizeMe } from 'dashboard/types';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './index.scss';

type IProps = ISizeMe;

const GRID_MARGIN = 10; // Cell间距
const RECT_BORDER_WIDTH = 1; // rect border宽度
const cols = 12;
const rowHeight = 30;
const getCellSize = (width: number) => ({
  width: (width - GRID_MARGIN) / cols,
  height: rowHeight + GRID_MARGIN,
});

const getGridBackground = (width: number) => {
  const cellSize = getCellSize(width);
  const front = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${(cellSize.width * cols) + (RECT_BORDER_WIDTH * 1)}' height='${cellSize.height}'>`;
  const back = '</svg>")';
  let colsStr = '';
  for (let i = 0; i < cols; i += 1) {
    colsStr += `<rect rx='4' ry='4' style='fill: #E5E9F2; opacity: 0.5' stroke-width='${RECT_BORDER_WIDTH}' fill='none' x='${Math.round(i * cellSize.width) + GRID_MARGIN}' y='${GRID_MARGIN}' width='${Math.round(cellSize.width - GRID_MARGIN - RECT_BORDER_WIDTH)}' height='${cellSize.height - GRID_MARGIN - RECT_BORDER_WIDTH}'/>`;
  }
  return `${front}${colsStr}${back}`;
};

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
  state = {
    isEdit: false,
  };

  onLayoutChange = () => {

  }

  onDragStart = () => this.state.isEdit;

  trigger = () => {
    this.setState({ isEdit: !this.state.isEdit });
  }

  render() {
    const { size } = this.props;
    const { width } = size;
    const { isEdit } = this.state;
    return (
      <div className={isEdit ? '' : 'bi-in-edit'}>
        <div className="bi-header">
          <Icon type={isEdit ? 'save' : 'edit'} onClick={this.trigger} />
        </div>
        <ReactGridLayout
          autoSize
          layout={layout}
          cols={cols}
          rowHeight={30}
          width={width}
          onLayoutChange={this.onLayoutChange}
          isDraggable
          isResizable
          style={isEdit ? { backgroundImage: getGridBackground(width) } : {}}
          onDragStart={this.onDragStart}
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
