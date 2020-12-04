/* Pure Dashboard without editor & global store
 * @Author: licao
 * @Date: 2020-12-04 15:10:37
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-04 16:13:42
 */
import React, { useRef } from 'react';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import { If } from 'tsx-control-statements/components';
import PureBoardGrid from './pure-grid';
import { useComponentWidth, DcEmpty } from '../../common';
import DashboardHeader from './header';
import DashboardStore from '../../stores/dash-board';

import './index.scss';

interface IPureProps {
  /**
   * Dashboard Name，used as the name of the export file
   *
   * @type {string}
   * @memberof IPureProps
   */
  name?: string;
  /**
   * Config data array to layout dashboard
   *
   * @type {DC.ILayout}
   * @memberof IPureProps
   */
  layout: DC.ILayout;
  /**
   * Whether to display the Dashboard general operation bar
   *
   * @type {boolean}
   * @memberof IPureProps
   */
  showOptions?: boolean;
}

const textMap = DashboardStore.getState((s) => s.textMap);

const PureDashboard = ({ name, layout, showOptions = false }: IPureProps) => {
  const boardRef = useRef(null);
  const [gridWidthHolder, gridWidth] = useComponentWidth();

  return (
    <div
      className={
        classnames({
          'dc-dashboard': true,
          'dark-border': true,
          'v-flex-box': true,
        })}
    >
      <If condition={showOptions}>
        <DashboardHeader
          contentRef={boardRef}
          dashboardName={name}
          readOnly
        />
      </If>
      <div className="dc-dashboard-content flex-1 v-flex-box" ref={boardRef}>
        <DcEmpty
          className="flex-1"
          description={textMap['no data']}
          condition={isEmpty(layout) || gridWidth === Infinity}
        />
        <div className="dc-dashboard-grid-wp">
          {gridWidthHolder}
          <PureBoardGrid width={gridWidth} layout={layout} />
        </div>
      </div>
    </div>
  );
};

export default PureDashboard;
