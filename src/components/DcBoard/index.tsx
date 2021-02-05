/* Dashboard with editor
 * @Author: licao
 * @Date: 2020-12-04 10:25:39
 * @Last Modified by: licao
 * @Last Modified time: 2021-02-04 20:09:30
 */
import React, { useRef, useEffect } from 'react';
import classnames from 'classnames';
import { isFunction } from 'lodash';
import 'react-grid-layout/css/styles.css';
import { useUnmount } from 'react-use';
import { DC } from 'src/types';
// 渲染器部分
import { useComponentWidth } from '../../common';
import DashboardHeader from './header';
import BoardGrid from './grid';
// 编辑器部分
import DcChartEditor from '../DcChartEditor';
import DiceDataConfigFormComponent from '../DcChartEditor/data-config/dice-form';
import { ConfigGlobalFiltersModal } from '../DcGlobalFilters';
import ChartEditorStore from '../../stores/chart-editor';

import '../../static/iconfont.js';
import '../../static/iconfont.css';
import './index.scss';


const DcBoard = ({
  timeSpan,
  name,
  APIFormComponent = DiceDataConfigFormComponent,
  layout,
  onEdit,
  onCancel,
  onSave,
  onEditorToggle,
  beforeOnSave,
}: DC.BoardGridProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardContentRef = useRef<HTMLDivElement>(null);
  const _onEditorToggle = useRef(onEditorToggle);

  const [isEditMode, editChartId] = ChartEditorStore.useStore((s) => [s.isEditMode, s.editChartId]);
  const { reset: resetDrawer, updateState, updateEditorContextMap } = ChartEditorStore;
  const chartEditorVisible = !!editChartId;
  const [gridWidthHolder, gridWidth] = useComponentWidth();

  useUnmount(() => {
    resetDrawer();
  });

  useEffect(() => {
    timeSpan && updateState({ timeSpan });
  }, [timeSpan, updateState]);

  useEffect(() => {
    if (isFunction(_onEditorToggle)) {
      _onEditorToggle(chartEditorVisible);
    }
  }, [chartEditorVisible]);

  useEffect(() => {
    updateEditorContextMap([
      {
        name: 'getAPIFormComponent',
        context: () => APIFormComponent,
      },
    ]);
  }, [APIFormComponent, updateEditorContextMap]);

  return (
    <div
      ref={boardRef}
      className={
        classnames({
          'dc-dashboard': true,
          'dark-border': true,
          'v-flex-box': true,
          active: isEditMode,
        })
      }
    >
      <DashboardHeader
        wrapRef={boardRef}
        contentRef={boardContentRef}
        dashboardName={name}
        afterEdit={onEdit}
        beforeSave={beforeOnSave}
        onSave={onSave}
        onCancel={onCancel}
      />
      <div ref={boardContentRef} className="dc-dashboard-content flex-1 v-flex-box">
        <div className="dc-dashboard-grid-wp flex-1">
          {gridWidthHolder}
          <BoardGrid width={gridWidth} layout={layout} />
        </div>
      </div>
      <ConfigGlobalFiltersModal />
      <DcChartEditor />
    </div>
  );
};

export default DcBoard;
