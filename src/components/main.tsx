import { Drawer, Input, Tooltip } from 'antd';
import classnames from 'classnames';
import { isEmpty, isFunction, map } from 'lodash';
import React, { useRef } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useMount, useUnmount } from 'react-use';
import screenfull from 'screenfull';
import { IF, useForceUpdate, useComponentWidth } from '../common';
import { TEXT_EN_MAP, TEXT_ZH_MAP } from '../constants';
import ChartEditor from '../editor';
import DefaultAPIFormComponent from '../editor/data-config/default-api-form';
import PickChartModal from '../editor/pick-chart-modal';
import ChartEditorStore from '../stores/chart-editor';
import DashboardStore from '../stores/dash-board';
import { theme, themeObj } from '../theme/dice';
import { formItemLayout, setScreenFull, saveImage } from '../utils/comp';
import { BoardGrid } from './grid';
import { DcIcon } from './index';
import './main.scss';

interface IProps {
  readOnly?: boolean // 隐藏编辑入口
  isEN?: boolean // 临时解决文案英文显示
  layout?: any // 配置信息，包含图表布局、各图表配置信息
  beforeOnSave?: () => boolean, // 返回 false 来拦截 onSave
  onSave?: (layout: any[], extra: { singleLayouts: any[]; viewMap: any; }) => void, // 保存
  onCancel?: () => void, // 取消编辑
  onEdit?: () => void, // 触发编辑
  onEditorToggle?: (status: boolean) => void, // 图表编辑态改变
  theme?: string, // 主题名
  themeObj?: {}, // 主题内容
  customCharts?: IChartsMap // 用户自定义图表（xx图）
  controlsMap?: IChartsMap // 控件
  UrlComponent?: React.ReactNode | React.SFC // 第三方系统的url配置器
  APIFormComponent?: React.ReactNode | React.SFC // 外部 API 表单配置器
  urlParamsMap?: { [name: string]: any } // 外部url参数映射
  urlItemLayout?: { [name: string]: any } // url的Form.Item布局
  // expandOption?: ({ chartType, url }: IExpand) => object // 扩展图表样式，不会再编辑器中被显示，应当设置对用户无感的全局自定义设置，否则会出现来回编辑清掉图表自定义设置后，又再次受到全局的影响
}


const DCMain = ({
  readOnly = false,
  isEN = false,
  UrlComponent = Input,
  APIFormComponent = DefaultAPIFormComponent,
  urlItemLayout = formItemLayout,
  layout,
  onEdit,
  onCancel,
  onSave,
  onEditorToggle,
  beforeOnSave,
}: IProps) => {
  const boardRef = useRef(null);
  const forceUpdate = useForceUpdate();

  const [isEditMode, textMap] = DashboardStore.useStore(s => [s.isEditMode, s.textMap]);
  const [viewMap, editChartId] = ChartEditorStore.useStore(s => [s.viewMap, s.editChartId]);
  const { setEditMode, saveEdit, updateContextMap, setTextMap } = DashboardStore;
  const { setPickChartModalVisible, reset: resetDrawer, addEditor } = ChartEditorStore;
  const chartEditorVisible = !isEmpty(viewMap[editChartId]);
  const [widthHolder, width] = useComponentWidth();

  useMount(() => {
    setTextMap(isEN ? TEXT_EN_MAP : TEXT_ZH_MAP);
  });

  useUnmount(() => {
    resetDrawer();
  });

  React.useEffect(() => {
    if (isFunction(onEditorToggle)) {
      onEditorToggle(chartEditorVisible);
    }
  }, [chartEditorVisible]);

  React.useEffect(() => {
    updateContextMap({
      theme,
      themeObj,
      getUrlComponent: () => UrlComponent,
      getAPIFormComponent: () => APIFormComponent,
      urlItemLayout,
    });
  }, [UrlComponent, APIFormComponent, urlItemLayout]);

  const doSave = () => {
    saveEdit().then((full: { layout: any[]; viewMap: { [k: string]: any } }) => {
      if (onSave) {
        const { layout: singleLayouts, viewMap: _viewMap } = full;
        const fullLayouts = map(singleLayouts, _layout => ({
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

  const handlePickChart = (chartType: ChartType) => {
    addEditor(chartType);
  };

  const isFullscreen = (screenfull as any).isFullscreen;
  const header = (
    <div className="dc-header">
      {
        isEditMode
          ? (
            <IF check={!chartEditorVisible}>
              <React.Fragment>
                <Tooltip placement="bottom" title={textMap.add}>
                  <DcIcon type="add" onClick={() => setPickChartModalVisible(true)} />
                </Tooltip>
                <Tooltip placement="bottom" title={textMap.save}>
                  <DcIcon type="save" onClick={_onSave} />
                </Tooltip>
                <Tooltip placement="bottom" title={textMap.cancel}>
                  <DcIcon type="close" onClick={_onCancel} />
                </Tooltip>
              </React.Fragment>
            </IF>
          )
          : (
            <React.Fragment>
              <Tooltip placement="bottom" title={isFullscreen ? textMap['exit fullscreen'] : textMap.fullscreen}>
                <DcIcon type={isFullscreen ? 'shrink' : 'full_screen'} onClick={onSetScreenFull} />
              </Tooltip>
              <Tooltip placement="bottom" title={textMap['export picture']}>
              <DcIcon type="capture" onClick={onSaveImg} />
            </Tooltip>
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
            </React.Fragment>
          )
      }
    </div>
  )

  return (
    <div
      className={classnames({
        'dc-grid': true,
        'dc-grid-off-edit': !isEditMode,
        isFullscreen,
      })}
    >
      {widthHolder}
      {!readOnly && header}
      <div className="dc-content" ref={boardRef}>
        <BoardGrid width={width} layout={layout} />
      </div>
      <Drawer
        width="90%"
        closable={false}
        maskClosable={false}
        bodyStyle={{ height: '100%', background: '#f4f3f7', padding: 0 }}
        visible={chartEditorVisible}
      >
        <ChartEditor />
      </Drawer>
      <PickChartModal onPickChart={handlePickChart} />
    </div>
  );
};

export default DCMain;
