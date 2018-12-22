/**
 * 栅格化仪表盘
 * 1、阻止拖动是通过onDragStart来实现而非isDraggable
 * 2、阻止缩放，是通过隐藏样式，而非isResizable
 * 因为react-grid-layout会在相关变化时子组件注销重新加载，从而导致图表重绘操作，
 * 见GridItem相关实现即知,https://github.com/STRML/react-grid-layout/blob/master/lib/GridItem.jsx
 */
import React from 'react';
import { connect } from 'dva';
import { Icon, Tooltip } from 'antd';
import ReactGridLayout from 'react-grid-layout';
import sizeMe from 'react-sizeme';
import classnames from 'classnames';
import { ChartLine, ChartDrawer, ChartOperation } from 'dashboard/components';
import { ISizeMe } from 'dashboard/types';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './index.scss';

type IProps = ISizeMe & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

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

class Board extends React.PureComponent<IProps> {
  componentWillMount() {
    this.props.initDashboardType();
  }

  onDragStart = () => this.props.isEdit;

  render() {
    const { size, onLayoutChange, layout, openDrawer, chartDatasMap, isEdit, openEdit, saveEdit } = this.props;
    const { width } = size;
    return (
      <div className={classnames({ 'bi-board': true, 'bi-off-edit': !isEdit })}>
        <div className="bi-header">
          {isEdit && <Icon type="plus" onClick={openDrawer} />}
          {isEdit ? (
            <Tooltip placement="bottom" title="保存">
              <Icon type="save" onClick={saveEdit} />
            </Tooltip>
          ) : (
            <Tooltip placement="bottom" title="编辑">
              <Icon type="edit" onClick={openEdit} />
            </Tooltip>
          )}
        </div>
        <ReactGridLayout
          autoSize
          layout={layout}
          cols={cols}
          rowHeight={30}
          width={width}
          onLayoutChange={onLayoutChange}
          isDraggable
          isResizable
          style={isEdit ? { backgroundImage: getGridBackground(width) } : {}}
          onDragStart={this.onDragStart}
        >
          {layout.map(({ i, ...others }: any) => {
            // 因ReactGridLayout内部实现原因，必须有data-grid，否则新增的图表大小会错乱
            const { chartType, names, datas, isMock } = chartDatasMap[i];
            switch (chartType) {
              case 'line':
              case 'bar':
              case 'area':
                return (
                  <div key={i} data-grid={{ ...others }}>
                    <ChartOperation chartId={i}>
                      <ChartLine names={names} datas={datas} isMock={isMock} />
                    </ChartOperation>
                  </div>
                );
              default:
                return null;
            }
          })}
        </ReactGridLayout>
        <ChartDrawer />
      </div>
    );
  }
}

const mapStateToProps = ({ biDashBoard: { layout, chartDatasMap, isEdit } }: any) => ({
  layout,
  chartDatasMap,
  isEdit,
});

const mapDispatchToProps = (dispatch: any) => ({
  initDashboardType() {
    dispatch({ type: 'biDashBoard/initDashboardType', dashboardType: 'board' });
  },
  onLayoutChange(layout: []) {
    dispatch({ type: 'biDashBoard/onLayoutChange', layout });
  },
  openDrawer() {
    dispatch({ type: 'biDrawer/openDrawer' });
  },
  openEdit() {
    dispatch({ type: 'biDashBoard/openEdit' });
  },
  saveEdit() {
    dispatch({ type: 'biDashBoard/saveEdit' });
  },
});

export default sizeMe({ monitorHeight: true })(connect(mapStateToProps, mapDispatchToProps)(Board));
