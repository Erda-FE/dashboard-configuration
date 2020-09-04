import { get, isEmpty, isPlainObject, map } from 'lodash';
import React, { useRef } from 'react';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ViewOperation } from '..';
import { getConfig } from '../../config';
import ChartEditorStore from '../../stores/chart-editor';
import DashboardStore from '../../stores/dash-board';

const GRID_MARGIN = 10; // Cell间距
const RECT_BORDER_WIDTH = 1; // rect border宽度
const cols = 24;
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
    colsStr += `<rect rx='4' ry='4' style='fill:rgb(229,233,242); opacity: 0.5' stroke-width='${RECT_BORDER_WIDTH}' fill='none' x='${Math.round(i * cellSize.width) + GRID_MARGIN}' y='${GRID_MARGIN}' width='${Math.round(cellSize.width - GRID_MARGIN - RECT_BORDER_WIDTH)}' height='${cellSize.height - GRID_MARGIN - RECT_BORDER_WIDTH}'/>`;
  }
  return `${front}${colsStr}${back}`;
};

const splitLayoutAndView = (layout: ILayout): [any[], any] => {
  const viewMap = {};
  const pureLayout = map(layout, (item) => {
    const { view, ...rest } = item;
    viewMap[item.i] = view;
    return rest;
  });
  return [pureLayout, viewMap];
};

export const BoardGrid = ({ width, layout }: any) => {
  const boardGridRef = useRef(null);

  const [dashboardLayout, isEditMode] = DashboardStore.useStore(s => [s.layout, s.isEditMode, s.textMap]);
  const viewMap = ChartEditorStore.useStore(s => s.viewMap);
  const { updateLayout, reset: resetBoard } = DashboardStore;
  const { updateViewMap: updateChildMap } = ChartEditorStore;
  console.log('dashboardLayout:', dashboardLayout);
  React.useEffect(() => () => resetBoard(), []);

  React.useEffect(() => {
    const [pureLayout, _viewMap] = splitLayoutAndView(layout);
    updateLayout(pureLayout);
    updateChildMap(_viewMap);
  }, [layout]);


  const onDragStart = React.useCallback(() => isEditMode, [isEditMode]);

  if (isEmpty(dashboardLayout) || width === Infinity) {
    return null;
  }
  // grid 组件内部会修改layout，而cube里的是不可直接更改的，所以重新生成一个对象
  const pure = dashboardLayout.map(p => ({ ...p }));
  const chartConfigMap = getConfig('chartConfigMap');
  return (
    <ReactGridLayout
      autoSize
      ref={boardGridRef}
      layout={pure}
      cols={cols}
      rowHeight={rowHeight}
      width={width}
      onLayoutChange={updateLayout}
      isDraggable
      isResizable={isEditMode}
      style={isEditMode ? { backgroundImage: getGridBackground(width) } : {}}
      onDragStart={onDragStart}
      draggableHandle=".dc-draggable-handle"
    >
      {map(pure, ({ i, ...others }: any) => {
        let ChildComp = null;
        let view = viewMap[i];
        view = typeof view === 'function'
          ? view({ isEditMode })
          : view;
        if (!view) {
          return null;
        }
        if (isPlainObject(view)) {
          const { chartType = '', customRender } = view;
          const ChartNode = get(chartConfigMap, [chartType, 'Component']) as any;
          const node = ChartNode ? <ChartNode {...view.chartProps} /> : null;
          ChildComp = (
            <React.Fragment>
              <ViewOperation viewId={i} view={view}>
                {
                  typeof customRender === 'function'
                    ? customRender(node, view)
                    : node
                }
              </ViewOperation>
            </React.Fragment>
          );
        } else {
          console.error('layout view should be object or function');
        }
        return (
          // 因ReactGridLayout内部实现原因，必须有data-grid，否则新增的图表大小会错乱
          <div key={i} data-grid={{ ...others }}>
            {ChildComp}
          </div>
        );
      })}
    </ReactGridLayout>
  );
};

