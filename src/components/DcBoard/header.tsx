/* Dashboard 工具栏
 * @Author: licao
 * @Date: 2020-12-03 16:19:32
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-10 19:42:07
 */
import React, { RefObject, useEffect, useCallback, useMemo } from 'react';
import { Button, Tooltip } from '@terminus/nusi';
import { useFullscreen, useToggle } from 'react-use';
import { If } from 'tsx-control-statements/components';
import { DcIcon } from '../../common';
import { insertWhen } from '../../common/utils';
import { saveImage } from '../../utils/comp';

import DashboardStore from '../../stores/dash-board';
import ChartEditorStore from '../../stores/chart-editor';

import './header.scss';

const textMap = DashboardStore.getState((s) => s.textMap);

interface IProps {
  wrapRef: RefObject<Element>;
  contentRef: RefObject<Element>;
  dashboardName?: string;
  readOnly?: boolean;
  afterEdit?: () => void;
  beforeSave?: () => boolean; // 返回 false 来拦截 onSave
  onSave?: (layout: any[], extra: { singleLayouts: any[]; viewMap: any }) => void; // 保存
  onCancel?: () => void; // 取消编辑
}

const DashboardHeader = ({
  wrapRef,
  contentRef,
  dashboardName,
  readOnly,
  afterEdit,
  beforeSave,
  onSave,
  onCancel,
}: IProps) => {
  // const forceUpdate = useForceUpdate();
  // 编辑态
  const [isEditMode] = DashboardStore.useStore((s) => [s.isEditMode]);
  const [viewMap] = ChartEditorStore.useStore((s) => [s.viewMap]);
  const { setEditMode, saveEdit, toggleFullscreen } = DashboardStore;
  const { setPickChartModalVisible } = ChartEditorStore;

  const [_isFullscreen, _toggleFullscreen] = useToggle(false);
  const isFullscreen = useFullscreen(wrapRef, _isFullscreen, { onClose: () => _toggleFullscreen() });

  useEffect(() => {
    toggleFullscreen(isFullscreen);
  }, [isFullscreen, toggleFullscreen]);

  const handleTriggerEditMode = useCallback(() => {
    setEditMode(true);
    afterEdit && afterEdit();
  }, [afterEdit, setEditMode]);

  const handleSaveImg = useCallback(() => {
    saveImage(contentRef.current, dashboardName || textMap['unnamed dashboard']);
  }, [contentRef, dashboardName]);

  const handleCancel = useCallback(() => {
    setEditMode(false);
    onCancel && onCancel();
  }, [onCancel, setEditMode]);

  const doSaveDashboard = useCallback(() => {
    saveEdit().then((full: { layout: any[]; viewMap: { [k: string]: any } }) => {
      if (onSave) {
        const { layout: singleLayouts, viewMap: _viewMap } = full;
        const fullLayouts = singleLayouts.map((_layout) => ({
          ..._layout,
          view: _viewMap[_layout.i],
        }));
        onSave(fullLayouts, { singleLayouts, viewMap });
      }
    });
  }, [onSave, saveEdit, viewMap]);

  const handleSaveDashboard = useCallback(() => {
    if (beforeSave) {
      const isContinue = beforeSave();
      if (isContinue) {
        doSaveDashboard();
      }
    } else {
      doSaveDashboard();
    }
  }, [beforeSave, doSaveDashboard]);

  const leftTools = useMemo(() => [
    ...insertWhen<DC_BOARD_HEADER.Tool>(!isFullscreen, [
      {
        icon: 'fullscreen',
        text: textMap.fullscreen,
        onClick: () => _toggleFullscreen(),
      },
    ]),
    ...insertWhen<DC_BOARD_HEADER.Tool>(isFullscreen, [
      {
        icon: 'fullscreen-exit',
        text: textMap['exit fullscreen'],
        onClick: () => _toggleFullscreen(),
      },
    ]),
    ...insertWhen<DC_BOARD_HEADER.Tool>(!isEditMode && !isFullscreen, [
      {
        icon: 'camera',
        text: textMap['export picture'],
        onClick: () => handleSaveImg(),
      },
    ]),
  ], [isEditMode, isFullscreen, handleSaveImg, _toggleFullscreen]);

  const editTools = useMemo(() => [
    ...insertWhen<DC_BOARD_HEADER.Tool>(!isEditMode, [
      {
        icon: 'edit',
        text: textMap['edit mode'],
        onClick: () => handleTriggerEditMode(),
      },
    ]),
    ...insertWhen<DC_BOARD_HEADER.Tool>(isEditMode, [
      {
        icon: 'plus',
        text: textMap['add charts'],
        onClick: () => setPickChartModalVisible(true),
      },
      {
        icon: 'save',
        text: textMap['save dashboard'],
        onClick: () => handleSaveDashboard(),
      },
      {
        icon: 'close',
        text: textMap['exit edit mode'],
        onClick: () => handleCancel(),
      },
    ]),
  ], [isEditMode, handleTriggerEditMode, handleSaveDashboard, handleCancel, setPickChartModalVisible]);

  const renderTools = (tools: DC_BOARD_HEADER.Tool[]) => tools.map(({ text, icon, onClick }) => (
    <Tooltip title={text} key={icon} >
      <Button type="text" onClick={onClick}>
        <DcIcon type={icon} />
      </Button>
    </Tooltip>
  ));

  return (
    <>
      <div className="dc-dashboard-header flex-box">
        <div className="dc-dashboard-tools dc-dashboard-left-tools flex-box">
          {renderTools(leftTools)}
          <If condition={isFullscreen}>
            <div className="fz18">{dashboardName}</div>
          </If>
        </div>
        <div className="dc-dashboard-tools dc-dashboard-right-tools">
          {!readOnly && !isFullscreen && renderTools(editTools)}
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
