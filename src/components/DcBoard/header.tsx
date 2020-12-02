import React, { RefObject, useCallback, useMemo } from 'react';
import { Button, Tooltip } from '@terminus/nusi';
import { useForceUpdate } from '../../common';
import { insertWhen } from '../../common/utils';
import { setScreenFull, saveImage } from '../../utils/comp';

import DashboardStore from '../../stores/dash-board';
import ChartEditorStore from '../../stores/chart-editor';

import './header.scss';

interface IProps {
  contentRef: RefObject<HTMLDivElement>;
  dashboardName?: string;
  readOnly?: boolean;
  afterEdit?: () => void;
  beforeSave?: () => boolean; // 返回 false 来拦截 onSave
  onSave?: (layout: any[], extra: { singleLayouts: any[]; viewMap: any }) => void; // 保存
  onCancel?: () => void; // 取消编辑
}

const DashboardHeader = ({
  contentRef,
  dashboardName,
  readOnly,
  afterEdit,
  beforeSave,
  onSave,
  onCancel,
}: IProps) => {
  const forceUpdate = useForceUpdate();
  // 编辑态
  const [isEditMode, textMap] = DashboardStore.useStore((s) => [s.isEditMode, s.textMap]);
  const [viewMap] = ChartEditorStore.useStore((s) => [s.viewMap]);
  const { setEditMode, saveEdit } = DashboardStore;
  const { setPickChartModalVisible } = ChartEditorStore;

  const handleTriggerEditMode = useCallback(() => {
    setEditMode(true);
    afterEdit && afterEdit();
  }, [afterEdit, setEditMode]);

  const handleSetScreenFull = (dom: HTMLDivElement | null) => {
    setScreenFull(dom);
  };

  const handleSaveImg = useCallback((dom: HTMLDivElement | null, name?: string) => {
    saveImage(
      dom,
      name || textMap['unnamed dashboard'],
      {
        errorMsg: textMap['no chart data'],
        loadingMsg: textMap['exporting picture'],
      },
    );
  }, [textMap]);

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
    {
      icon: 'grow',
      text: textMap.fullscreen,
      onClick: () => handleSetScreenFull(contentRef.current),
    },
    ...insertWhen(!isEditMode, [
      {
        icon: 'camera',
        text: textMap['export picture'],
        onClick: () => handleSaveImg(contentRef.current, dashboardName),
      },
    ]),
  ], [contentRef, dashboardName, handleSaveImg, isEditMode, textMap]);

  const editTools = useMemo(() => [
    ...insertWhen(!isEditMode, [
      {
        icon: 'edit',
        text: textMap.edit,
        onClick: () => handleTriggerEditMode(),
      },
    ]),
    ...insertWhen(isEditMode, [
      {
        icon: 'plus-circle',
        text: textMap.add,
        onClick: () => setPickChartModalVisible(true),
      },
      {
        icon: 'check',
        text: textMap.save,
        onClick: () => handleSaveDashboard(),
      },
      {
        icon: 'close',
        text: textMap.cancel,
        onClick: () => handleCancel(),
      },
    ]),
  ], [textMap, isEditMode, handleTriggerEditMode, handleSaveDashboard, handleCancel, setPickChartModalVisible]);

  const renderTools = (tools: typeof leftTools) => tools.map(({ text, icon, onClick }) => (
    <Tooltip title={text} key={icon} >
      <Button type="text" icon={icon} onClick={onClick} />
    </Tooltip>
  ));

  return (
    <>
      <div className="dc-dashboard-header flex-box">
        <div className="dc-dashboard-tools dc-dashboard-left-tools">
          {renderTools(leftTools)}
        </div>
        <div className="dc-dashboard-tools dc-dashboard-right-tools">
          {!readOnly && renderTools(editTools)}
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
