/* Pure Dashboard without editor & global store
 * @Author: licao
 * @Date: 2020-12-04 15:10:37
 * @Last Modified by: licao
 * @Last Modified time: 2021-02-26 14:22:59
 */
import React, { useRef } from 'react';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import PureBoardGrid from './pure-grid';
import { DcEmpty, useComponentWidth } from 'src/common';
import DashboardHeader from './pure-header';
import DashboardStore from 'src/stores/dash-board';
import { Wrapper } from 'src/utils/locale';
import './index.scss';

const PureDashboard = ({ name, layout, showOptions = false, globalVariable, onBoardEvent }: DC.PureBoardGridProps) => {
  const [textMap, locale] = DashboardStore.getState((s) => [s.textMap, s.locale]);
  const boardRef = useRef<HTMLDivElement>(null);
  const boardContentRef = useRef<HTMLDivElement>(null);
  const [gridWidthHolder, gridWidth] = useComponentWidth();

  return (
    <Wrapper locale={locale}>
      <div
        ref={boardRef}
        className={classnames({
          'dc-dashboard': true,
          'v-flex-box': true,
        })}
      >
        <If condition={showOptions}>
          <DashboardHeader wrapRef={boardRef} contentRef={boardContentRef} dashboardName={name} />
        </If>
        <div ref={boardContentRef} className="dc-dashboard-content flex-1 v-flex-box">
          <DcEmpty
            className="flex-1"
            description={textMap['No data']}
            condition={isEmpty(layout) || gridWidth === Infinity}
          />
          <div className="dc-dashboard-grid-wp">
            {gridWidthHolder}
            <PureBoardGrid
              width={gridWidth}
              layout={layout}
              globalVariable={globalVariable}
              onBoardEvent={onBoardEvent}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default PureDashboard;
