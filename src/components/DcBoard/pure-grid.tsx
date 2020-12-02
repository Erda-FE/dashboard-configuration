import React, { useRef, useEffect } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import screenfull from 'screenfull';
import { useComponentWidth, useForceUpdate, useUpdate } from '../../common';
import { setScreenFull, saveImage } from '../../utils/comp';
import { DcIcon, DcContainer } from '../index';
import DashboardStore from '../../stores/dash-board';

import './index.scss';

import { get, isEmpty, isPlainObject, map } from 'lodash';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { getConfig } from '../../config';

const cols = 24;
const rowHeight = 30;

const splitLayoutAndView = (layout: DC.ILayout): [any[], any] => {
  const viewMap = {};
  const pureLayout = map(layout, (item) => {
    const { view, ...rest } = item;
    viewMap[item.i] = view;
    return rest;
  });
  return [pureLayout, viewMap];
};

const BoardGrid = ({ width, layout }: { width: any; layout: DC.ILayout }) => {
  const boardGridRef = useRef(null);
  const [{ pureLayout, viewMap }, updater] = useUpdate({
    pureLayout: [],
    viewMap: {},
  });

  useEffect(() => {
    const [_pureLayout, _viewMap] = splitLayoutAndView(layout);
    updater.pureLayout(_pureLayout);
    updater.viewMap(_viewMap);
  }, [layout, updater]);


  if (isEmpty(pureLayout) || width === Infinity) {
    return null;
  }
  // grid 组件内部会修改 layout，而 cube 里的是不可直接更改的，所以重新生成一个对象
  // const pure = layout.map(p => ({ ...p }));
  const chartConfigMap = getConfig('chartConfigMap');
  return (
    <ReactGridLayout
      autoSize
      ref={boardGridRef}
      layout={pureLayout}
      isDraggable={false}
      cols={cols}
      rowHeight={rowHeight}
      width={width}
      containerPadding={[0, 0]}
      isResizable={false}
    >
      {map(pureLayout, ({ i, ...others }: any) => {
        let ChildComp = null;
        const view = viewMap[i];
        if (isPlainObject(view)) {
          const { chartType = '' } = view;
          const ChartNode = get(chartConfigMap, [chartType, 'Component']) as any;
          const node = ChartNode ? <ChartNode {...view.chartProps} /> : <></>;
          ChildComp = <DcContainer viewId={i} view={view}>{node}</DcContainer>;
        } else {
          // eslint-disable-next-line no-console
          console.error('layout view should be object');
        }

        return (
          // 因ReactGridLayout内部实现原因，必须有data-grid，否则新增的图表大小会错乱
          <div key={i} data-grid={{ ...others }}>
            {ChildComp}
          </div>
        );
      })}
    </ReactGridLayout>
  );
};

interface IPureProps {
  layout: any;
  showOptions?: boolean;
}

// 只作渲染器使用
export default ({ layout, showOptions = false }: IPureProps) => {
  const { isFullscreen } = screenfull as any;
  const boardRef = useRef(null);
  const forceUpdate = useForceUpdate();
  const [widthHolder, width] = useComponentWidth();
  const textMap = DashboardStore.useStore((s) => s.textMap);

  const onSetScreenFull = () => {
    setScreenFull(boardRef.current);
    forceUpdate();
  };

  const onSaveImg = () => {
    if (boardRef.current) {
      saveImage(boardRef.current, 'dashboard', textMap); // eslint-disable-line
    }
  };

  const commonOptions = [
    <Tooltip
      placement="bottom"
      title={isFullscreen ? textMap['exit fullscreen'] : textMap.fullscreen}
      key="fullscreen"
    >
      <DcIcon
        type={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
        onClick={onSetScreenFull}
      />
    </Tooltip>,
    <Tooltip
      placement="bottom"
      title={textMap['export picture']}
      key="saveImg"
    >
      <DcIcon type="camera" onClick={onSaveImg} />
    </Tooltip>,
  ];

  return (
    <div
      className={classnames({
        'dc-dashboard': true,
        isFullscreen,
      })}
    >
      {widthHolder}
      {showOptions && <div className="dc-header">{commonOptions}</div>}
      <div className="dc-content" ref={boardRef}>
        <BoardGrid width={width} layout={layout} />
      </div>
    </div>
  );
};
