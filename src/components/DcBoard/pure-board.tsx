/* Pure Dashboard without editor & global store
 * @Author: licao
 * @Date: 2020-12-04 15:10:37
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-25 16:27:48
 */
import React, { useRef } from 'react';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import { If } from 'tsx-control-statements/components';
import PureBoardGrid from './pure-grid';
import { useComponentWidth, DcEmpty } from '../../common';
import DashboardHeader from './pure-header';
import DashboardStore from '../../stores/dash-board';

import './index.scss';

const textMap = DashboardStore.getState((s) => s.textMap);

interface IPureProps {
  /** 大盘名 */
  name?: string;
  /** 大盘配置 */
  layout: DC.ILayout;
  /** 是否显示大盘全局操作栏 */
  showOptions?: boolean;
}

const PureDashboard = ({ name, layout, showOptions = false }: IPureProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardContentRef = useRef<HTMLDivElement>(null);
  const [gridWidthHolder, gridWidth] = useComponentWidth();

  return (
    <div
      ref={boardRef}
      className={
        classnames({
          'dc-dashboard': true,
          'dark-border': true,
          'v-flex-box': true,
        })}
    >
      <If condition={showOptions}>
        <DashboardHeader
          wrapRef={boardRef}
          contentRef={boardContentRef}
          dashboardName={name}
        />
      </If>
      <div ref={boardContentRef} className="dc-dashboard-content flex-1 v-flex-box">
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
