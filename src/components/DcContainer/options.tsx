/* 单图操作工具栏
 * @Author: licao
 * @Date: 2020-12-04 17:57:36
 * @Last Modified by: licao
 * @Last Modified time: 2021-01-26 15:45:36
 */

import React, { memo, ReactNode, RefObject, useCallback, useEffect, useMemo } from 'react';
import { Dropdown, Menu, Modal } from 'antd';
import { useFullscreen, useToggle } from 'react-use';
import { DcIcon } from 'src/common';
import { insertWhen } from 'src/common/utils';
import { saveImage } from 'src/utils/comp';
import ChartEditorStore from 'src/stores/chart-editor';
import DashboardStore from 'src/stores/dash-board';
import './index.scss';

const { Item: MenuItem } = Menu;

interface IProps {
  viewId: string;
  viewRef: RefObject<Element>;
  view: any;
  disabled?: boolean;
  children: ReactNode;
  toggleFullscreen: (v: boolean) => void;
}

const Options = ({ view, viewId, viewRef, children, disabled = false, toggleFullscreen }: IProps) => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  const [isEditMode] = ChartEditorStore.useStore((s) => [s.isEditMode]);
  const { deleteView } = ChartEditorStore;

  const [_isFullscreen, _toggleFullscreen] = useToggle(false);
  const isFullscreen = useFullscreen(viewRef, _isFullscreen, { onClose: () => _toggleFullscreen() });

  useEffect(() => {
    toggleFullscreen(isFullscreen);
  }, [isFullscreen, toggleFullscreen]);

  const handleRemoveItem = useCallback(() => {
    Modal.confirm({
      content: `${textMap['confirm to remove']} ${view.title}?`,
      okText: textMap.delete,
      cancelText: textMap.Cancel,
      onOk() {
        deleteView(viewId);
      },
    });
  }, [deleteView, textMap, view.title, viewId]);

  const handleSaveImg = useCallback(() => {
    saveImage(viewRef.current, view.title || textMap['unnamed dashboard']);
  }, [textMap, view.title, viewRef]);

  const options: DC_BOARD_HEADER.Tool[] = useMemo(
    () => [
      {
        icon: 'fullscreen',
        text: textMap['Full screen'],
        onClick: () => _toggleFullscreen(),
      },
      {
        icon: 'camera',
        text: textMap.Export,
        onClick: () => handleSaveImg(),
      },
      ...insertWhen<DC_BOARD_HEADER.Tool>(isEditMode, [
        {
          icon: 'delete',
          text: textMap['Remove charts'],
          onClick: () => handleRemoveItem(),
        },
      ]),
    ],
    [textMap, isEditMode, _toggleFullscreen, handleSaveImg, handleRemoveItem],
  );

  return (
    <Dropdown
      disabled={disabled}
      trigger={['click']}
      overlay={
        <Menu>
          {options.map((option) => (
            <MenuItem key={option.icon}>
              <a className="dc-chart-title-dp-op" onClick={option.onClick}>
                <DcIcon type={option.icon} />
                {option.text}
              </a>
            </MenuItem>
          ))}
        </Menu>
      }
    >
      {children}
    </Dropdown>
  );
};

export default memo(Options);
