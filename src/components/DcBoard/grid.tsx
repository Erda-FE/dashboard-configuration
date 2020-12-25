/* ReactGridLayout connect to global store
 * @Author: licao
 * @Date: 2020-12-04 15:08:25
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-25 19:54:43
 */
import * as React from 'react';
import { isEmpty } from 'lodash';
import ReactGridLayout from 'react-grid-layout';
import { genGridItems } from './common';
import { GRID_LAYOUT_CONFIG } from '../../constants';
import { splitLayoutAndView } from './common/utils';
import ChartEditorStore from '../../stores/chart-editor';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const BoardGrid = ({ width, layout }: { width: any; layout: DC.ILayout }) => {
  const [dashboardLayout, isEditMode, viewMap] = ChartEditorStore.useStore((s) => [s.layout, s.isEditMode, s.viewMap]);
  const { updateViewMap: updateChildMap, updateLayout } = ChartEditorStore;

  React.useEffect(() => {
    const [a, b] = splitLayoutAndView(layout);
    updateLayout(a);
    updateChildMap(b);
  }, [layout, updateChildMap, updateLayout]);

  if (isEmpty(dashboardLayout) || width === Infinity) {
    return null;
  }

  // grid 组件内部会修改layout，而cube里的是不可直接更改的，所以重新生成一个对象
  const pureLayout = dashboardLayout.map((p) => ({ ...p }));

  return (
    <ReactGridLayout
      autoSize
      layout={pureLayout}
      width={width}
      cols={GRID_LAYOUT_CONFIG.cols}
      rowHeight={GRID_LAYOUT_CONFIG.rowHeight}
      containerPadding={[0, 0]}
      isDraggable
      draggableHandle=".dc-draggable-handle"
      isResizable={isEditMode}
      useCSSTransforms
      onLayoutChange={updateLayout}
    >
      {genGridItems(pureLayout, viewMap)}
    </ReactGridLayout>
  );
};

export default BoardGrid;
