import { Drawer, Input, Tooltip } from 'antd';
import classnames from 'classnames';
import { isEmpty, isFunction, map } from 'lodash';
import React, { useRef, useEffect } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useUnmount } from 'react-use';
import screenfull from 'screenfull';
import { Choose, When, Otherwise, If } from 'tsx-control-statements/components';
import { useForceUpdate, useComponentWidth } from '../../common';
import DcChartEditor from '../DcChartEditor';
import DiceDataConfigFormComponent from '../DcChartEditor/data-config/dice-form';
import PickChartModal from '../DcChartEditor/pick-chart';
import ChartEditorStore from '../../stores/chart-editor';
import DashboardStore from '../../stores/dash-board';
import { formItemLayout, setScreenFull, saveImage } from '../../utils/comp';
import { BoardGrid } from './grid';
import { DcIcon } from '../index';

import './index.scss';
import '../../static/iconfont.css';

interface IProps {
  readOnly?: boolean; // 隐藏编辑入口
  layout?: any; // 配置信息，包含图表布局、各图表配置信息
  showOptions?: boolean;
  beforeOnSave?: () => boolean; // 返回 false 来拦截 onSave
  onSave?: (layout: any[], extra: { singleLayouts: any[]; viewMap: any }) => void; // 保存
  onCancel?: () => void; // 取消编辑
  onEdit?: () => void; // 触发编辑
  onEditorToggle?: (status: boolean) => void; // 图表编辑态改变
  // customCharts?: DC.ViewDefMap // 用户自定义图表（xx图）
  // controlsMap?: DC.ViewDefMap // 控件
  UrlComponent?: React.ReactNode | React.SFC; // 第三方系统的url配置器
  APIFormComponent?: React.ReactNode | React.SFC; // 外部 API 表单配置器
  urlItemLayout?: { [name: string]: any }; // url的Form.Item布局
}

const DCMain = ({
  readOnly = false,
  showOptions = false,
  UrlComponent = Input,
  APIFormComponent = DiceDataConfigFormComponent,
  urlItemLayout = formItemLayout,
  layout,
  onEdit,
  onCancel,
  onSave,
  onEditorToggle,
  beforeOnSave,
}: IProps) => {
  const boardRef = useRef(null);
  const _onEditorToggle = useRef(onEditorToggle);
  const forceUpdate = useForceUpdate();

  const [isEditMode, textMap] = DashboardStore.useStore((s) => [s.isEditMode, s.textMap]);
  const [viewMap, editChartId] = ChartEditorStore.useStore((s) => [s.viewMap, s.editChartId]);
  const { setEditMode, saveEdit, updateContextMap } = DashboardStore;
  const { setPickChartModalVisible, reset: resetDrawer, addEditor } = ChartEditorStore;
  const chartEditorVisible = !isEmpty(viewMap[editChartId]);
  const [widthHolder, width] = useComponentWidth();

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
      getUrlComponent: () => UrlComponent,
      getAPIFormComponent: () => APIFormComponent,
      urlItemLayout,
    });
  }, [UrlComponent, APIFormComponent, urlItemLayout, updateContextMap]);

  const doSave = () => {
    saveEdit().then((full: { layout: any[]; viewMap: { [k: string]: any } }) => {
      if (onSave) {
        const { layout: singleLayouts, viewMap: _viewMap } = full;
        const fullLayouts = map(singleLayouts, (_layout) => ({
          ..._layout,
          view: _viewMap[_layout.i],
        }));
        onSave(fullLayouts, { singleLayouts, viewMap });
      }
    });
  };

  const _onSave = () => {
    if (beforeOnSave) {
      const isContinue = beforeOnSave();
      if (isContinue) {
        doSave();
      }
    } else {
      doSave();
    }
  };

  const _onCancel = () => {
    setEditMode(false);
    if (onCancel) {
      onCancel();
    }
  };

  const onSaveImg = () => {
    if (boardRef.current) {
      saveImage(boardRef.current, 'dashboard', textMap); // eslint-disable-line
    }
  };

  const onSetScreenFull = () => {
    setScreenFull(boardRef.current);
    forceUpdate();
  };

  const handlePickChart = (chartType: DC.ViewType) => {
    addEditor(chartType);
  };

  const { isFullscreen } = screenfull as any;
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
  const boardOperations = [];
  const header = (
    <div className="dc-header">
      <Choose>
        <When condition={isEditMode}>
          <If condition={!chartEditorVisible}>
            <Tooltip placement="bottom" title={textMap.add}>
              <DcIcon type="plus" onClick={() => setPickChartModalVisible(true)} />
            </Tooltip>
            <Tooltip placement="bottom" title={textMap.save}>
              <DcIcon type="save" onClick={_onSave} />
            </Tooltip>
            <Tooltip placement="bottom" title={textMap.cancel}>
              <DcIcon type="close" onClick={_onCancel} />
            </Tooltip>
          </If>
        </When>
        <Otherwise>
          {commonOptions}
          <Tooltip placement="bottom" title={textMap.edit}>
            <DcIcon
              type="edit"
              onClick={() => {
                setEditMode(true);
                if (onEdit) {
                  onEdit();
                }
              }}
            />
          </Tooltip>
        </Otherwise>
      </Choose>
    </div>
  );

  return (
    <div
      className={classnames({
        'dc-grid': true,
        isFullscreen,
      })}
    >
      {widthHolder}
      {!readOnly && header}
      {showOptions && <div className="dc-header">{commonOptions}</div>}
      <div className="dc-content" ref={boardRef}><BoardGrid width={width} layout={layout} /></div>
      <Drawer
        width="100%"
        closable={false}
        maskClosable={false}
        bodyStyle={{ height: '100%', background: '#f4f3f7', padding: 0 }}
        visible={chartEditorVisible}
      >
        <DcChartEditor />
      </Drawer>
      <PickChartModal onPickChart={handlePickChart} />
    </div>
  );
};

export default DCMain;
