/**
 * 栅格化仪表盘
 * 1、阻止拖动是通过onDragStart来实现而非isDraggable
 * 2、阻止缩放，是通过隐藏样式，而非isResizable
 * 因为react-grid-layout会在相关变化时子组件注销重新加载，从而导致图表重绘，
 * 见GridItem相关实现即知,https://github.com/STRML/react-grid-layout/blob/master/lib/GridItem.jsx
 */
import { Icon, Input, Tooltip } from 'antd';
import classnames from 'classnames';
import { connect } from 'dva';
import { get, isEqual, isPlainObject } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { SizeMe } from 'react-sizeme';
import screenfull from 'screenfull';
import { registCharts } from '../config';
import { theme, themeObj } from '../theme/dice';
import { formItemLayout, saveImage, setScreenFull } from '../utils/comp';
import { ChartDrawer, ChartOperation, defaultChartsMap } from '../components';
import { IChartsMap, IExpand, ILayout } from '../types';
import './index.scss';


interface IUrlData {
  type: string
  url: string
  data: any
}

interface IProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  readOnly?: boolean // 只读
  layout?: any // 配置信息，包含图表布局、各图表配置信息
  onSave?: (extra: any) => void, // 保存
  theme?: string, // 主题名
  themeObj?: {}, // 主题内容
  chartsMap?: IChartsMap // 图表
  controlsMap?: IChartsMap // 控件
  UrlComponent?: React.ReactNode | React.SFC // 第三方系统的url配置器
  urlParamsMap?: { [name: string]: any } // 外部url参数映射
  urlItemLayout?: { [name: string]: any } // url的Form.Item布局
  urlDataHandle?: ({ type, url, data }: IUrlData) => any // 接口数据处理
  expandOption?: ({ viewType, url }: IExpand) => object // 扩展图表样式，不会再编辑器中被显示，应当设置对用户无感的全局自定义设置，否则会出现来回编辑清掉图表自定义设置后，又再次受到全局的影响
}

const GRID_MARGIN = 10; // Cell间距
const RECT_BORDER_WIDTH = 1; // rect border宽度
const cols = 12;
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

class BoardGrid extends React.PureComponent<IProps> {
  static defaultProps = {
    readOnly: false,
    theme,
    themeObj,
    UrlComponent: Input,
    urlItemLayout: formItemLayout,
  };

  static childContextTypes = {
    theme: PropTypes.string,
    themeObj: PropTypes.object,
    chartsMap: PropTypes.object,
    controlsMap: PropTypes.object,
    UrlComponent: PropTypes.func,
    urlItemLayout: PropTypes.object,
  };

  private boardGridRef: React.ReactInstance;

  private boardRef: HTMLDivElement;

  private chartsMap: IChartsMap;

  private controlsMap: IChartsMap;

  getChildContext() {
    return {
      theme: this.props.theme,
      themeObj: this.props.themeObj,
      chartsMap: this.chartsMap,
      controlsMap: this.controlsMap,
      UrlComponent: this.props.UrlComponent,
      urlItemLayout: this.props.urlItemLayout,
    };
  }

  // componentWillMount() {
  // const { layout } = this.props;
  // const [pureLayout, viewMap] = this.splitLayoutAndView(layout);
  // this.props.updateLayout(pureLayout);
  // this.props.updateChildMap(viewMap);
  // this.chartsMap = registCharts({ ...defaultChartsMap, ...this.props.chartsMap });
  // this.controlsMap = { ...defaultControlsMap, ...this.props.controlsMap };
  // paramsManage.set(this.props.urlParamsMap);
  // registerUrlDataHandle(this.props.urlDataHandle);
  // }

  componentWillReceiveProps({ layout, dashboardLayout, chartsMap, controlsMap, urlParamsMap, urlDataHandle }: IProps) {
    if (!isEqual(dashboardLayout, this.props.dashboardLayout)) {
      this.props.updateLayout(dashboardLayout);
    }
    if (!isEqual(chartsMap, this.props.chartsMap)) {
      this.chartsMap = { ...defaultChartsMap, ...chartsMap };
    }
    if (!isEqual(layout, this.props.layout)) {
      const [pureLayout, viewMap] = this.splitLayoutAndView(layout);
      this.props.updateLayout(pureLayout);
      this.props.updateChildMap(viewMap);
      this.chartsMap = registCharts({ ...defaultChartsMap, ...this.props.chartsMap });
    }
    // if (!isEqual(controlsMap, this.props.controlsMap)) {
    //   this.controlsMap = { ...defaultControlsMap, ...controlsMap };
    // }
    // if (!isEqual(urlParamsMap, this.props.urlParamsMap)) {
    //   paramsManage.set(urlParamsMap);
    // }
    // if (urlDataHandle !== this.props.urlDataHandle) {
    //   registerUrlDataHandle(this.props.urlDataHandle);
    // }
  }

  componentWillUnmount() {
    this.props.resetBoard();
    this.props.resetDrawer();
  }

  splitLayoutAndView = (layout: ILayout) => {
    const viewMap = {};
    const pureLayout = layout.map((item) => {
      const { view, ...rest } = item;
      viewMap[item.i] = view;
      return rest;
    });
    return [pureLayout, viewMap];
  }

  onDragStart = () => this.props.isEdit;

  onSave = () => {
    const { saveEdit, onSave } = this.props;
    saveEdit().then((full: any) => {
      if (onSave) onSave(full);
    });
  }

  onSaveImg = () => {
    saveImage(ReactDOM.findDOMNode(this.boardGridRef), '仪表盘'); // eslint-disable-line
  }

  onSetScreenFull = () => {
    setScreenFull(this.boardRef, screenfull.isFullscreen);
    this.forceUpdate();
  }

  render() {
    const {
      dashboardLayout, viewMap, isEdit, openEdit, readOnly,
      expandOption, updateLayout, addEditor,
    } = this.props;
    const { isFullscreen } = screenfull; // 是否全屏
    if (!dashboardLayout.length) {
      return null;
    }
    return (
      <div
        style={{ flex: 2 }}
        className={classnames({ 'bi-board': true, 'bi-off-edit': !isEdit, isFullscreen })}
        ref={(ref: HTMLDivElement) => { this.boardRef = ref; }}
      >
        {!readOnly && (
          <div className="bi-header">
            {
              isEdit
                ? (
                  <React.Fragment>
                    <Tooltip placement="bottom" title="新增">
                      <Icon type="plus" onClick={addEditor} />
                    </Tooltip>
                    <Tooltip placement="bottom" title="保存">
                      <Icon type="save" onClick={this.onSave} />
                    </Tooltip>
                  </React.Fragment>
                )
                : (
                  <React.Fragment>
                    <Tooltip placement="bottom" title={isFullscreen ? '退出全屏' : '图表全屏'}>
                      <Icon type={isFullscreen ? 'shrink' : 'arrows-alt'} onClick={this.onSetScreenFull} />
                    </Tooltip>
                    <Tooltip placement="bottom" title="导出图片">
                      <Icon type="camera" onClick={this.onSaveImg} />
                    </Tooltip>
                    <Tooltip placement="bottom" title="编辑">
                      <Icon type="edit" onClick={openEdit} />
                    </Tooltip>
                  </React.Fragment>
                )
            }
          </div>
        )}
        <SizeMe monitorHeight>
          {({ size }) => (
            <ReactGridLayout
              ref={(ref: React.ReactInstance) => { this.boardGridRef = ref; }}
              autoSize
              layout={dashboardLayout}
              cols={cols}
              rowHeight={30}
              width={size.width}
              onLayoutChange={updateLayout}
              isDraggable
              isResizable
              style={isEdit ? { backgroundImage: getGridBackground(size.width) } : {}}
              onDragStart={this.onDragStart}
              draggableHandle=".bi-draggable-handle"
            >
              {dashboardLayout.map(({ i, ...others }: any) => {
                let ChildComp = null;
                let view = viewMap[i];
                view = typeof view === 'function'
                  ? view({ isEdit, isFullscreen })
                  : view;
                if (!view) {
                  return null;
                }
                if (isPlainObject(view)) {
                  const { viewType = '' } = view;
                  if (viewType.startsWith('chart')) {
                    // const [, viewType = 'line'] = viewType.split(':');
                    // const { controlType } = viewMap[i];
                    const ChartNode = get(this.chartsMap, [viewType, 'Component']);
                    ChildComp = (
                      <React.Fragment>
                        <ChartOperation viewId={i} view={view} expandOption={expandOption}>
                          <ChartNode />
                        </ChartOperation>
                      </React.Fragment>
                    );
                  }
                  // else {
                  //   ChartNode = get(this.controlsMap, [controlType, 'Component']);
                  //   ChildComp = (
                  //     <ControlOperation viewId={i}>
                  //       <ChartNode viewId={i} />
                  //     </ControlOperation>
                  //   );
                  // }
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
          )}
        </SizeMe>
        <ChartDrawer />
        {/* <LinkSettingModal /> */}
      </div>
    );
  }
}

const mapStateToProps = ({
  biDashBoard: { layout, isEdit },
  biEditor: { viewMap },
}: any) => ({
  dashboardLayout: layout,
  viewMap,
  isEdit,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateLayout(layout: any) {
    dispatch({ type: 'biDashBoard/updateState', payload: { layout } });
  },
  updateChildMap(viewMap: any) {
    dispatch({ type: 'biEditor/updateState', payload: { viewMap } });
  },
  addEditor() {
    dispatch({ type: 'biEditor/addEditor' });
  },
  openEdit() {
    dispatch({ type: 'biDashBoard/openEdit' });
  },
  saveEdit() {
    return dispatch({ type: 'biDashBoard/saveEdit' });
  },
  resetBoard() {
    return dispatch({ type: 'biDashBoard/reset' });
  },
  resetDrawer() {
    return dispatch({ type: 'biEditor/reset' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardGrid);
