/* Dashboard with editor
 * @Author: licao
 * @Date: 2020-12-04 10:25:39
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-26 16:36:32
 */
import React, { useRef, useEffect } from 'react';
import classnames from 'classnames';
import { isFunction } from 'lodash';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useUnmount } from 'react-use';
// 渲染器部分
import { useComponentWidth } from '../../common';
import DashboardHeader from './header';
import BoardGrid from './grid';
// 编辑器部分
import DcChartEditor from '../DcChartEditor';
import DiceDataConfigFormComponent from '../DcChartEditor/data-config/dice-form';
import ChartEditorStore from '../../stores/chart-editor';

import './index.scss';
import '../../static/iconfont.css';

interface IProps {
  /** 指定编辑器的预览时间 */
  timeSpan?: { startTimeMs: number; endTimeMs: number };
  /** 大盘名 */
  name?: string;
  /** 配置信息，包含图表布局、各图表配置信息 */
  layout: DC.ILayout;
  /** 外部数据源表单配置器，机制待完善 */
  APIFormComponent?: React.ReactNode;
  /** 返回 false 来拦截 onSave */
  beforeOnSave?: () => boolean;
  /** 保存大盘回调 */
  onSave?: (layout: DC.ILayout[], extra: { singleLayouts: any[]; viewMap: Record<string, DC.View> }) => void;
  /** 取消大盘编辑模式回调 */
  onCancel?: () => void;
  /** 触发大盘编辑模式回调 */
  onEdit?: () => void;
  /** 进入图表编辑模式回调 */
  onEditorToggle?: (status: boolean) => void;
}

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
}: IProps) => {
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
        <div className="dc-dashboard-grid-wp full-height">
          {gridWidthHolder}
          <BoardGrid width={gridWidth} layout={layout} />
        </div>
      </div>
      <DcChartEditor />
    </div>
  );
};

export default DcBoard;
