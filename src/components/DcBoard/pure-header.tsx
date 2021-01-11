/* PureDashboard 工具栏
 * @Author: licao
 * @Date: 2020-12-03 16:19:32
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-25 16:28:17
 */
import React, { RefObject, useEffect, useCallback, useMemo } from 'react';
import { Button, Tooltip } from '@terminus/nusi';
import { useFullscreen, useToggle } from 'react-use';
import { If } from 'tsx-control-statements/components';
import { DcIcon } from '../../common';
import { insertWhen } from '../../common/utils';
import { saveImage } from '../../utils/comp';
import DashboardStore from '../../stores/dash-board';

import './header.scss';

const textMap = DashboardStore.getState((s) => s.textMap);

interface IProps {
  wrapRef: RefObject<Element>;
  contentRef: RefObject<Element>;
  dashboardName?: string;
}

const DashboardHeader = ({
  wrapRef,
  contentRef,
  dashboardName,
}: IProps) => {
  const { toggleFullscreen } = DashboardStore;
  const [_isFullscreen, _toggleFullscreen] = useToggle(false);
  const isFullscreen = useFullscreen(wrapRef, _isFullscreen, { onClose: () => _toggleFullscreen() });

  useEffect(() => {
    toggleFullscreen(isFullscreen);
  }, [isFullscreen, toggleFullscreen]);

  const handleSaveImg = useCallback(() => {
    saveImage(contentRef.current, dashboardName || textMap['unnamed dashboard']);
  }, [contentRef, dashboardName]);

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
    ...insertWhen<DC_BOARD_HEADER.Tool>(!isFullscreen, [
      {
        icon: 'camera',
        text: textMap['export picture'],
        onClick: () => handleSaveImg(),
      },
    ]),
  ], [isFullscreen, handleSaveImg, _toggleFullscreen]);

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
      </div>
    </>
  );
};

export default DashboardHeader;
