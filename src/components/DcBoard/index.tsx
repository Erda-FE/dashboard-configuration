import classnames from 'classnames';
import { isEmpty, isFunction } from 'lodash';
import React, { useRef, useEffect } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useUnmount } from 'react-use';
import { useComponentWidth, DcEmpty } from '../../common';
import DcChartEditor from '../DcChartEditor';
import DiceDataConfigFormComponent from '../DcChartEditor/data-config/dice-form';
import PickChartModal from '../DcChartEditor/pick-chart';
import ChartEditorStore from '../../stores/chart-editor';
import DashboardStore from '../../stores/dash-board';
import DashboardHeader from './header';
import { BoardGrid } from './grid';

import './index.scss';
import '../../static/iconfont.css';

interface IProps {
  name?: string; // 大盘名
  layout?: any; // 配置信息，包含图表布局、各图表配置信息
  beforeOnSave?: () => boolean; // 返回 false 来拦截 onSave
  onSave?: (layout: any[], extra: { singleLayouts: any[]; viewMap: any }) => void; // 保存
  onCancel?: () => void; // 取消编辑
  onEdit?: () => void; // 触发编辑
  onEditorToggle?: (status: boolean) => void; // 图表编辑态改变
  APIFormComponent?: React.ReactNode | React.SFC; // 外部数据源表单配置器
}

const DcBoard = ({
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
  const _onEditorToggle = useRef(onEditorToggle);

  const isEditMode = DashboardStore.useStore((s) => s.isEditMode);
  const [viewMap, editChartId] = ChartEditorStore.useStore((s) => [s.viewMap, s.editChartId]);
  const { updateContextMap } = DashboardStore;
  const { reset: resetDrawer, addEditor } = ChartEditorStore;
  const chartEditorVisible = !isEmpty(viewMap[editChartId]);
  const [gridWidthHolder, gridWidth] = useComponentWidth();

  useUnmount(() => {
    resetDrawer();
  });

  useEffect(() => {
    if (isFunction(_onEditorToggle)) {
      _onEditorToggle(chartEditorVisible);
    }
  }, [chartEditorVisible]);

  useEffect(() => {
    updateContextMap({
      getAPIFormComponent: () => APIFormComponent,
    });
  }, [APIFormComponent, updateContextMap]);

  const handlePickChart = (chartType: DC.ViewType) => {
    addEditor(chartType);
  };

  return (
    <div
      className={
        classnames({
          'dc-dashboard': true,
          'dark-border': true,
          'v-flex-box': true,
          active: isEditMode,
          // isFullscreen,
        })
      }
    >
      <DashboardHeader
        contentRef={boardRef}
        dashboardName={name}
        afterEdit={onEdit}
        beforeSave={beforeOnSave}
        onSave={onSave}
        onCancel={onCancel}
      />
      <div className="dc-dashboard-content flex-1 v-flex-box" ref={boardRef}>
        <DcEmpty
          className="flex-1"
          description="暂无数据"
          condition={isEmpty(layout) || gridWidth === Infinity}
        />
        <div className="dc-dashboard-grid-wp">
          {gridWidthHolder}
          <BoardGrid width={gridWidth} layout={layout} />
        </div>
      </div>
      <DcChartEditor />
      <PickChartModal onPickChart={handlePickChart} />
    </div>
  );
};

export default DcBoard;
