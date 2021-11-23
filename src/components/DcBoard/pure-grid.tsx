/* ReactGridLayout without global store
 * @Author: licao
 * @Date: 2020-12-04 15:07:46
 * @Last Modified by: licao
 * @Last Modified time: 2021-02-26 18:20:41
 */
import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import ReactGridLayout from 'react-grid-layout';
import { GRID_LAYOUT_CONFIG } from 'src/constants';
import { splitLayoutAndView } from './common/utils';
import { genGridItems } from './common';

interface IProps {
  width: any;
  layout: DC.Layout;
  globalVariable?: Record<string, any>;
  onBoardEvent?: DC.onBoardEvent;
}

const PureBoardGrid = ({ width, layout, globalVariable, onBoardEvent }: IProps) => {
  const [pureLayout, viewMap] = useMemo(() => splitLayoutAndView(layout), [layout]);
  const gridItems = useMemo(
    () =>
      genGridItems({
        pureLayout,
        viewMap,
        globalVariable,
        onBoardEvent,
        isPure: true,
      }),
    [globalVariable, onBoardEvent, pureLayout, viewMap],
  );

  if (isEmpty(pureLayout) || width === Infinity) return null;
  const copyPureLayout = pureLayout.map((p) => ({ ...p }));

  return (
    <ReactGridLayout
      autoSize
      layout={copyPureLayout}
      width={width}
      cols={GRID_LAYOUT_CONFIG.cols}
      rowHeight={GRID_LAYOUT_CONFIG.rowHeight}
      containerPadding={[0, 0]}
      isDraggable={false}
      isResizable={false}
      useCSSTransforms
    >
      {gridItems}
    </ReactGridLayout>
  );
};

export default PureBoardGrid;
