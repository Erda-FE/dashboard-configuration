/* ReactGridLayout connect to global store
 * @Author: licao
 * @Date: 2020-12-04 15:08:25
 * @Last Modified by: licao
 * @Last Modified time: 2021-01-15 13:45:55
 */
import * as React from 'react';
import { isEmpty, map } from 'lodash';
import ReactGridLayout from 'react-grid-layout';
import { genGridItems } from './common';
import { DcEmpty } from '../../common';
import { GRID_LAYOUT_CONFIG } from '../../constants';
import { splitLayoutAndView } from './common/utils';
import ChartEditorStore from '../../stores/chart-editor';
import DashboardStore from '../../stores/dash-board';

import 'react-grid-layout/css/styles.css';

const textMap = DashboardStore.getState((s) => s.textMap);

const BoardGrid = ({ width, layout }: { width: any; layout: DC.ILayout }) => {
  const [isEditMode, viewMap, pureLayout] = ChartEditorStore.useStore((s) => [s.isEditMode, s.viewMap, s.pureLayout]);
  const { updateViewMap: updateChildMap, updateLayout } = ChartEditorStore;

  React.useEffect(() => {
    const [a, b] = splitLayoutAndView(layout);
    updateLayout(a);
    updateChildMap(b);
  }, [layout, updateChildMap, updateLayout]);

  if (isEmpty(pureLayout) || width === Infinity) {
    return (
      <DcEmpty
        className="full-height"
        description={textMap['no data']}
        condition
      />
    );
  }

  // grid 组件内部会修改layout，而cube里的是不可直接更改的，所以重新生成一个对象
  const _pureLayout = map(pureLayout, (p) => ({ ...p }));

  return (
    <ReactGridLayout
      autoSize
      layout={_pureLayout}
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
      {genGridItems(_pureLayout, viewMap)}
    </ReactGridLayout>
  );
};

export default BoardGrid;
