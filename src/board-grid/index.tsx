/**
 * 栅格化仪表盘
 * 1、阻止拖动是通过onDragStart来实现而非isDraggable
 * 2、阻止缩放，是通过隐藏样式，而非isResizable
 * 因为react-grid-layout会在相关变化时子组件注销重新加载，从而导致图表重绘，
 * 见GridItem相关实现即知,https://github.com/STRML/react-grid-layout/blob/master/lib/GridItem.jsx
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Icon, Tooltip, Input } from 'antd';
import { isEqual, get } from 'lodash';
import ReactGridLayout from 'react-grid-layout';
import sizeMe from 'react-sizeme';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { defaultChartsMap, defaultControlsMap, ChartDrawer, ChartOperation } from '../components';
import { ISizeMe, IChartsMap } from '../types';
import { theme, themeObj } from './utils/theme-dice';
import { paramsManage, saveImage, setScreenFull } from '../components/utils';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './index.scss';

interface IProps extends ISizeMe, ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  readOnly?: boolean // 只读
  extra?: any // 配置信息，包含图表布局、各图表配置信息
  onSave?: (extra: any) => void, // 保存
  theme?: string, // 主题名
  themeObj?: {}, // 主题内容
  onConvert?: (resData: object, chartId: string, url: string) => object | Promise<any> // 数据转化
  chartsMap?: IChartsMap // 图表
  controlsMap?: IChartsMap // 控件
  UrlComponent?: React.ReactNode | React.SFC // 第三方系统的url配置器
  urlParamsMap?: { [name: string]: any } // 外部url参数映射
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
    colsStr += `<rect rx='4' ry='4' style='fill: #E5E9F2; opacity: 0.5' stroke-width='${RECT_BORDER_WIDTH}' fill='none' x='${Math.round(i * cellSize.width) + GRID_MARGIN}' y='${GRID_MARGIN}' width='${Math.round(cellSize.width - GRID_MARGIN - RECT_BORDER_WIDTH)}' height='${cellSize.height - GRID_MARGIN - RECT_BORDER_WIDTH}'/>`;
  }
  return `${front}${colsStr}${back}`;
};

class BoardGrid extends React.PureComponent<IProps> {
  static defaultProps = {
    readOnly: false,
    theme,
    themeObj,
    UrlComponent: Input,
  };

  static childContextTypes = {
    theme: PropTypes.string,
    themeObj: PropTypes.object,
    chartsMap: PropTypes.object,
    controlsMap: PropTypes.object,
    UrlComponent: PropTypes.func,
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
    };
  }

  componentWillMount() {
    this.props.initDashboard(this.props.extra);
    this.chartsMap = { ...defaultChartsMap, ...this.props.chartsMap };
    this.controlsMap = { ...defaultControlsMap, ...this.props.controlsMap };
    paramsManage.set(this.props.urlParamsMap);
  }

  componentWillReceiveProps({ extra, chartsMap, controlsMap, urlParamsMap }: IProps) {
    if (!isEqual(extra, this.props.extra)) {
      this.props.initDashboard(extra);
    }
    if (!isEqual(chartsMap, this.props.chartsMap)) {
      this.chartsMap = { ...defaultChartsMap, ...chartsMap };
    }
    if (!isEqual(controlsMap, this.props.controlsMap)) {
      this.controlsMap = { ...defaultControlsMap, ...controlsMap };
    }
    if (!isEqual(urlParamsMap, this.props.urlParamsMap)) {
      paramsManage.set(urlParamsMap);
    }
  }

  componentWillUnmount() {
    this.props.resetBoard();
  }

  onDragStart = () => this.props.isEdit;

  onSave = () => {
    const { saveEdit, onSave } = this.props;
    saveEdit().then((extra: any) => {
      if (onSave) onSave(extra);
    });
  }

  onSaveImg = () => {
    saveImage(ReactDOM.findDOMNode(this.boardGridRef), '仪表盘'); // eslint-disable-line
  }

  onSetScreenFull = () => {
    setScreenFull(this.boardRef, false);
  }

  render() {
    const { size, onLayoutChange, layout, openDrawerAdd, drawerInfoMap, isEdit, openEdit, readOnly, onConvert } = this.props;
    const { width } = size;
    return (
      <div
        className={classnames({ 'bi-board': true, 'bi-off-edit': !isEdit })}
        ref={(ref: HTMLDivElement) => { this.boardRef = ref; }}
      >
        {!readOnly && (
          <div className="bi-header">
            {!isEdit && (
              <span>
                <Tooltip placement="bottom" title="图表全屏">
                  <Icon type="arrows-alt" onClick={this.onSetScreenFull} />
                </Tooltip>
                <Tooltip placement="bottom" title="导出图片">
                  <Icon type="camera" onClick={this.onSaveImg} />
                </Tooltip>
              </span>)
            }
            {isEdit && <Icon type="plus" onClick={openDrawerAdd} />}
            {isEdit ? (
              <Tooltip placement="bottom" title="保存">
                <Icon type="save" onClick={this.onSave} />
              </Tooltip>
            ) : (
              <Tooltip placement="bottom" title="编辑">
                <Icon type="edit" onClick={openEdit} />
              </Tooltip>
            )}
          </div>
        )}
        <ReactGridLayout
          ref={(ref: React.ReactInstance) => { this.boardGridRef = ref; }}
          autoSize
          layout={layout}
          cols={cols}
          rowHeight={30}
          width={width}
          onLayoutChange={onLayoutChange}
          isDraggable
          isResizable
          style={isEdit ? { backgroundImage: getGridBackground(width) } : {}}
          onDragStart={this.onDragStart}
        >
          {layout.map(({ i, ...others }: any) => {
            // 因ReactGridLayout内部实现原因，必须有data-grid，否则新增的图表大小会错乱
            const { chartType } = drawerInfoMap[i];
            const ChartNode = get(this.chartsMap, [chartType, 'component']) as any;
            return (
              <div key={i} data-grid={{ ...others }}>
                <ChartOperation chartId={i} onConvert={onConvert}>
                  <ChartNode chartId={i} />
                </ChartOperation>
              </div>
            );
          })}
        </ReactGridLayout>
        <ChartDrawer />
      </div>
    );
  }
}

const mapStateToProps = ({ biDashBoard: { layout, isEdit }, biDrawer: { drawerInfoMap } }: any) => ({
  layout,
  drawerInfoMap,
  isEdit,
});

const mapDispatchToProps = (dispatch: any) => ({
  initDashboard(extra: any) {
    dispatch({ type: 'biDashBoard/initDashboard', dashboardType: 'grid', extra });
  },
  onLayoutChange(layout: []) {
    dispatch({ type: 'biDashBoard/onLayoutChange', layout });
  },
  openDrawerAdd() {
    dispatch({ type: 'biDrawer/openDrawerAdd' });
  },
  openEdit() {
    dispatch({ type: 'biDashBoard/openEdit' });
  },
  saveEdit() {
    return dispatch({ type: 'biDashBoard/saveEdit' });
  },
  resetBoard() {
    return dispatch({ type: 'biDashBoard/resetBoard' });
  },
});

export default sizeMe({ monitorHeight: true })(connect(mapStateToProps, mapDispatchToProps)(BoardGrid));
