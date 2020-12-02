import { get, isEmpty, isPlainObject, map } from 'lodash';
import React, { useRef } from 'react';
import ReactGridLayout from 'react-grid-layout';
import { Empty } from '@terminus/nusi';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { DcContainer } from '..';
import { getConfig } from '../../config';
import ChartEditorStore from '../../stores/chart-editor';
import DashboardStore from '../../stores/dash-board';

const cols = 24; // grid col 数
const rowHeight = 30; // 行高

const splitLayoutAndView = (layout: DC.ILayout): [any[], any] => {
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

  const [dashboardLayout, isEditMode] = DashboardStore.useStore((s) => [s.layout, s.isEditMode, s.textMap]);
  const viewMap = ChartEditorStore.useStore((s) => s.viewMap);
  const { updateLayout, reset: resetBoard } = DashboardStore;
  const { updateViewMap: updateChildMap } = ChartEditorStore;
  React.useEffect(() => () => resetBoard(), [resetBoard]);

  React.useEffect(() => {
    const [pureLayout, _viewMap] = splitLayoutAndView(layout);
    updateLayout(pureLayout);
    updateChildMap(_viewMap);
  }, [layout, updateChildMap, updateLayout]);


  const onDragStart = React.useCallback(() => isEditMode, [isEditMode]);

  if (isEmpty(dashboardLayout) || width === Infinity) {
    return null;
  }

  // grid 组件内部会修改layout，而cube里的是不可直接更改的，所以重新生成一个对象
  const pure = dashboardLayout.map((p) => ({ ...p }));
  const chartConfigMap = getConfig('chartConfigMap');
  return (
    <ReactGridLayout
      autoSize
      ref={boardGridRef}
      layout={pure}
      cols={cols}
      rowHeight={rowHeight}
      width={width}
      containerPadding={[0, 0]}
      onLayoutChange={updateLayout}
      isDraggable
      isResizable={isEditMode}
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
          const { chartType = '' } = view;
          const ChartNode = get(chartConfigMap, [chartType, 'Component']) as any;
          const node = ChartNode ? <ChartNode {...view.chartProps} /> : <></>;
          ChildComp = <DcContainer viewId={i} view={view}>{node}</DcContainer>;
        } else {
          // eslint-disable-next-line no-console
          console.error('layout view should be object or function');
        }
        // 因ReactGridLayout内部实现原因，必须有data-grid，否则新增的图表大小会错乱
        return <div key={i} data-grid={{ ...others }}>{ChildComp}</div>;
      })}
    </ReactGridLayout>
  );
};
