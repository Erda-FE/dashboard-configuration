import { Input, Tooltip, Drawer } from 'antd';
import classnames from 'classnames';
import { get, isPlainObject, isEmpty, map, isFunction } from 'lodash';
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { useUnmount, useMount } from 'react-use';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import screenfull from 'screenfull';
import { registCharts } from '../../config';
import { theme, themeObj } from '../../theme/dice';
import { formItemLayout, saveImage, setScreenFull } from '../../utils/comp';
import { ChartOperation, defaultChartsMap, DcIcon } from '..';
import { EmptyHolder, IF, useForceUpdate, useComponentWidth } from '../../common';
import DefaultAPIFormComponent from '../../editor/data-config/default-api-form';
import ChartEditor from '../../editor';
import DashboardStore from '../../stores/dash-board';
import ChartEditorStore from '../../stores/chart-editor';
import PickChartModal from '../../editor/pick-chart-modal';
import { TEXT_EN_MAP, TEXT_ZH_MAP } from '../../constants';
import './index.scss';

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
  expandOption?: ({ chartType, url }: IExpand) => object // 扩展图表样式，不会再编辑器中被显示，应当设置对用户无感的全局自定义设置，否则会出现来回编辑清掉图表自定义设置后，又再次受到全局的影响
}

const GRID_MARGIN = 10; // Cell间距
const RECT_BORDER_WIDTH = 1; // rect border宽度
const cols = 24;
const rowHeight = 30;
const getCellSize = (width: number) => ({
  width: (width - GRID_MARGIN) / cols,
  height: rowHeight + GRID_MARGIN,
});

const getGridBackground = (width: number) => {
  const cellSize = getCellSize(width);
  const front = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${(cellSize.width * cols) + (RECT_BORDER_WIDTH * 1)}' height='${cellSize.height}'>`;
  const back = '</svg>")';
  let colsStr = '';
  for (let i = 0; i < cols; i += 1) {
    colsStr += `<rect rx='4' ry='4' style='fill:rgb(229,233,242); opacity: 0.5' stroke-width='${RECT_BORDER_WIDTH}' fill='none' x='${Math.round(i * cellSize.width) + GRID_MARGIN}' y='${GRID_MARGIN}' width='${Math.round(cellSize.width - GRID_MARGIN - RECT_BORDER_WIDTH)}' height='${cellSize.height - GRID_MARGIN - RECT_BORDER_WIDTH}'/>`;
  }
  return `${front}${colsStr}${back}`;
};

const splitLayoutAndView = (layout: ILayout): [any[], any] => {
  const viewMap = {};
  const pureLayout = map(layout, (item) => {
    const { view, ...rest } = item;
    viewMap[item.i] = view;
    return rest;
  });
  return [pureLayout, viewMap];
};

const CustomNode = ({ ChartNode, render, view }: any) => render(ChartNode, view);

const BoardGrid = ({
  readOnly = false,
  isEN = false,
  UrlComponent = Input,
  APIFormComponent = DefaultAPIFormComponent,
  urlItemLayout = formItemLayout,
  customCharts,
  layout,
  onEdit,
  onCancel,
  onSave,
  onEditorToggle,
  beforeOnSave,
  expandOption,
}: IProps) => {
  const boardGridRef = useRef(null);
  const boardRef = useRef(null);
  const forceUpdate = useForceUpdate();

  const [dashboardLayout, isEditMode, textMap, chartConfigMap] = DashboardStore.useStore(s => [s.layout, s.isEditMode, s.textMap, s.chartConfigMap]);
  const [viewMap, editChartId] = ChartEditorStore.useStore(s => [s.viewMap, s.editChartId]);
  const { updateLayout, setEditMode, saveEdit, reset: resetBoard, updateContextMap, setTextMap, setChartConfigMap } = DashboardStore;
  const { updateViewMap: updateChildMap, setPickChartModalVisible, reset: resetDrawer, addEditor } = ChartEditorStore;
  const chartEditorVisible = !isEmpty(viewMap[editChartId]);
  const [widthHolder, width] = useComponentWidth();

  useMount(() => {
    setTextMap(isEN ? TEXT_EN_MAP : TEXT_ZH_MAP);
  });

  useUnmount(() => {
    resetBoard();
    resetDrawer();
  });

  React.useEffect(() => {
    setChartConfigMap(registCharts({ ...defaultChartsMap, ...customCharts }));
  }, [customCharts]);

  React.useEffect(() => {
    const [pureLayout, _viewMap] = splitLayoutAndView(layout);
    updateLayout(pureLayout);
    updateChildMap(_viewMap);
  }, [layout]);

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
  }, [chartConfigMap, UrlComponent, APIFormComponent, urlItemLayout]);

  const onDragStart = React.useCallback(() => isEditMode, [isEditMode]);

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
    if (boardGridRef.current) {
      saveImage(ReactDOM.findDOMNode(boardGridRef.current), 'dashboard', textMap); // eslint-disable-line
    }
  };

  const onSetScreenFull = () => {
    setScreenFull(boardRef.current, screenfull.isFullscreen);
    forceUpdate();
  };

  const handlePickChart = (chartType: ChartType) => {
    addEditor(chartType);
  };

  return (
    <div
      style={{ flex: 2 }}
      className={classnames({
        'dc-grid': true,
        'dc-grid-off-edit': !isEditMode,
        isFullscreen: screenfull.isFullscreen,
      })}
    >
      {/* 在非readonly下顶部右上角的编辑菜单 */}
      {!readOnly && (
        <div className="dashboard-header">
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
                      <span className="dc-iconfont dc-icon-save"></span>
                    </Tooltip>
                    <Tooltip placement="bottom" title={textMap.cancel}>
                      <DcIcon type="close" onClick={_onCancel} />
                    </Tooltip>
                  </React.Fragment>
                </IF>
              )
              : (
                <React.Fragment>
                  <Tooltip placement="bottom" title={screenfull.isFullscreen ? textMap['exit fullscreen'] : textMap.fullscreen}>
                    <DcIcon type={screenfull.isFullscreen ? 'shrink' : 'full_screen'} onClick={onSetScreenFull} />
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
      )}
      <div className="dashboard-content" ref={boardRef}>
        <div className="chart-view">
          {widthHolder}
          <IF check={isEmpty(dashboardLayout)}>
            <EmptyHolder />
            <IF.ELSE />
            <ReactGridLayout
              ref={boardGridRef}
              autoSize
              layout={dashboardLayout}
              cols={cols}
              rowHeight={rowHeight}
              width={width || 800}
              onLayoutChange={updateLayout}
              isDraggable
              isResizable
              style={isEditMode ? { backgroundImage: getGridBackground(width || 800) } : {}}
              onDragStart={onDragStart}
              draggableHandle=".dc-draggable-handle"
            >
              {map(dashboardLayout, ({ i, ...others }: any) => {
                let ChildComp = null;
                let view = viewMap[i];
                view = typeof view === 'function'
                  ? view({ isEditMode, isFullscreen: screenfull.isFullscreen })
                  : view;
                if (!view) {
                  return null;
                }
                if (isPlainObject(view)) {
                  const { chartType = '', customRender } = view;
                  const ChartNode = get(chartConfigMap, [chartType, 'Component']);
                  ChildComp = (
                    <React.Fragment>
                      <ChartOperation viewId={i} view={view} expandOption={expandOption}>
                        {
                          typeof customRender === 'function'
                            ? <CustomNode render={customRender} ChartNode={ChartNode} view={view} />
                            : <ChartNode {...view.chartProps} />
                        }
                      </ChartOperation>
                    </React.Fragment>
                  );
                } else {
                  console.error('layout view should be object or function');
                }
                return (
                  // 因ReactGridLayout内部实现原因，必须有data-grid，否则新增的图表大小会错乱
                  <div key={i} data-grid={{ ...others }}>
                    {ChildComp}
                  </div>
                );
              })}
            </ReactGridLayout>
          </IF>
        </div>
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

export default BoardGrid;
