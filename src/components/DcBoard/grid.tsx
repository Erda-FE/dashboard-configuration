/* ReactGridLayout connect to global store
 * @Author: licao
 * @Date: 2020-12-04 15:08:25
 * @Last Modified by: licao
 * @Last Modified time: 2021-03-04 10:11:25
 */
import React, { useMemo, useEffect } from 'react';
import { isEmpty, map } from 'lodash';
import ReactGridLayout from 'react-grid-layout';
import { DC } from 'src/types';
import { genGridItems } from './common';
import { DcEmpty } from '../../common';
import { GRID_LAYOUT_CONFIG } from '../../constants';
import { splitLayoutAndView } from './common/utils';
import ChartEditorStore from '../../stores/chart-editor';
import DashboardStore from '../../stores/dash-board';
import GlobalFiltersStore from '../../stores/global-filters';

import 'react-grid-layout/css/styles.css';

const textMap = DashboardStore.getState((s) => s.textMap);

interface IProps {
  width: any;
  layout: DC.Layout;
  globalVariable?: Record<string, any>;
}

const BoardGrid = ({ width, layout, globalVariable }: IProps) => {
  const [
    isEditMode,
    editChartId,
    viewMap,
    pureLayout,
  ] = ChartEditorStore.useStore((s) => [s.isEditMode, s.editChartId, s.viewMap, s.pureLayout]);
  const { updateViewMap: updateChildMap, updateLayout } = ChartEditorStore;
  const storeGlobalVariable = GlobalFiltersStore.useStore((s) => s.globalVariable);

  useEffect(() => {
    const [a, b] = splitLayoutAndView(layout);
    updateLayout(a);
    updateChildMap(b);
  }, [layout, updateChildMap, updateLayout]);

  // grid 组件内部会修改layout，而cube里的是不可直接更改的，所以重新生成一个对象
  const _pureLayout = map(pureLayout, (p) => ({ ...p }));
  // 外部指定的变量优先级高于内部产生的变量
  const children = useMemo(() => genGridItems({
    pureLayout: _pureLayout,
    viewMap,
    globalVariable: { ...storeGlobalVariable, ...globalVariable },
  }), [_pureLayout, globalVariable, storeGlobalVariable, viewMap]);

  if (isEmpty(pureLayout) || width === Infinity) {
    return (
      <DcEmpty
        className="full-height"
        description={textMap['no data']}
        condition
      />
    );
  }

  return (
    <ReactGridLayout
      autoSize
      layout={_pureLayout}
      width={width}
      cols={GRID_LAYOUT_CONFIG.cols}
      rowHeight={GRID_LAYOUT_CONFIG.rowHeight}
      containerPadding={[0, 0]}
      isDraggable={isEditMode && !editChartId}
      draggableHandle=".dc-chart-header"
      isResizable={isEditMode}
      useCSSTransforms
      onLayoutChange={updateLayout}
    >
      {children}
    </ReactGridLayout>
  );
};

export default BoardGrid;
