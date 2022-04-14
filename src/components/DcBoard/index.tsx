/* Dashboard with editor
 * @Author: licao
 * @Date: 2020-12-04 10:25:39
 * @Last Modified by: licao
 * @Last Modified time: 2021-03-03 20:38:30
 */
import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import { isFunction } from 'lodash';
import 'react-grid-layout/css/styles.css';
import { useUnmount } from 'react-use';
// 渲染器部分
import { useComponentWidth } from 'src/common';
import DashboardHeader from './header';
import BoardGrid from './grid';
import GlobalFilters from 'src/components/DcGlobalFilters';
// 编辑器部分
import DiceDataConfigFormComponent from 'src/components/DcChartEditor/data-config/dice-form';
import { ConfigGlobalFiltersModal } from 'src/components/DcGlobalFilters/config-modal';
import ChartEditorStore from 'src/stores/chart-editor';

import 'src/static/iconfont.js';
import 'src/static/iconfont.css';
import './index.scss';
import DashboardStore from 'src/stores/dash-board';
import { Wrapper } from 'src/utils/locale';
import EditorPanel from 'src/components/DcChartEditor/editor-panel';

const DcBoard = ({
  timeSpan,
  name,
  APIFormComponent = DiceDataConfigFormComponent,
  layout,
  globalVariable,
  slot,
  onEdit,
  onCancel,
  onSave,
  onEditorToggle,
  beforeOnSave,
}: DC.BoardGridProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardContentRef = useRef<HTMLDivElement>(null);
  const _onEditorToggle = useRef(onEditorToggle);
  const locale = DashboardStore.getState((s) => s.locale);
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
    <Wrapper locale={locale}>
      <div
        ref={boardRef}
        className={classnames({
          'dc-dashboard': true,
          'v-flex-box': true,
          active: isEditMode,
        })}
      >
        <DashboardHeader
          wrapRef={boardRef}
          contentRef={boardContentRef}
          dashboardName={name}
          afterEdit={onEdit}
          slot={slot}
          beforeSave={beforeOnSave}
          onSave={onSave}
          onCancel={onCancel}
        />
        <div ref={boardContentRef} className="dc-dashboard-content flex-1 v-flex-box">
          <GlobalFilters />
          <div className="dc-dashboard-grid-wp flex-1">
            {gridWidthHolder}
            <BoardGrid width={gridWidth} layout={layout} globalVariable={globalVariable} />
          </div>
        </div>
        <ConfigGlobalFiltersModal />
        <EditorPanel />
      </div>
    </Wrapper>
  );
};

export default DcBoard;
