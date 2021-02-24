/* ReactGridLayout without global store
 * @Author: licao
 * @Date: 2020-12-04 15:07:46
 * @Last Modified by: licao
 * @Last Modified time: 2021-02-23 13:56:57
 */
import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';
import ReactGridLayout from 'react-grid-layout';
import { DC } from 'src/types';
import { GRID_LAYOUT_CONFIG } from '../../constants';
import { splitLayoutAndView } from './common/utils';
import { useUpdate } from '../../common';
import { genGridItems } from './common';

const PureBoardGrid = ({ width, layout }: { width: any; layout: DC.Layout }) => {
  const [{
    pureLayout,
    viewMap,
  }, updater] = useUpdate({
    pureLayout: [],
    viewMap: {},
  });

  useEffect(() => {
    const [a, b] = splitLayoutAndView(layout);
    updater.pureLayout(a);
    updater.viewMap(b);
  }, [layout, updater]);

  if (isEmpty(pureLayout) || width === Infinity) {
    return null;
  }

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
      {genGridItems(copyPureLayout, viewMap, true)}
    </ReactGridLayout>
  );
};

export default PureBoardGrid;
