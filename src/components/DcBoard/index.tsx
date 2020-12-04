/* Dashboard with editor
 * @Author: licao
 * @Date: 2020-12-04 10:25:39
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-04 16:19:13
 */
import React, { useRef, useEffect } from 'react';
import classnames from 'classnames';
import { isEmpty, isFunction } from 'lodash';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useUnmount } from 'react-use';
// 渲染器部分
import { useComponentWidth, DcEmpty } from '../../common';
import DashboardHeader from './header';
import BoardGrid from './grid';
// 编辑器部分
import DcChartEditor from '../DcChartEditor';
import DiceDataConfigFormComponent from '../DcChartEditor/data-config/dice-form';

import ChartEditorStore from '../../stores/chart-editor';
import DashboardStore from '../../stores/dash-board';

import './index.scss';
import '../../static/iconfont.css';

interface IProps {
  name?: string; // 大盘名
  layout: DC.ILayout; // 配置信息，包含图表布局、各图表配置信息
  APIFormComponent?: React.ReactNode; // 外部数据源表单配置器
  beforeOnSave?: () => boolean; // 返回 false 来拦截 onSave
  onSave?: (layout: DC.ILayout[], extra: { singleLayouts: any[]; viewMap: any }) => void; // 保存
  onCancel?: () => void; // 取消编辑
  onEdit?: () => void; // 触发编辑
  onEditorToggle?: (status: boolean) => void; // 图表编辑态改变
}

const textMap = DashboardStore.getState((s) => s.textMap);

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
  const { reset: resetDrawer } = ChartEditorStore;
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

  return (
    <div
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
          description={textMap['no data']}
          condition={isEmpty(layout) || gridWidth === Infinity}
        />
        <div className="dc-dashboard-grid-wp">
          {gridWidthHolder}
          <BoardGrid width={gridWidth} layout={layout} />
        </div>
      </div>
      <DcChartEditor />
    </div>
  );
};

export default DcBoard;
