import { Icon, Input, Popconfirm, Tooltip } from 'antd';
import classnames from 'classnames';
import { connect } from 'dva';
import { isEmpty, isString, isEqual, get } from 'lodash';
import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import screenfull from 'screenfull';
import { getConfig } from '../../../config';
import { saveImage, setScreenFull } from '../../../utils/comp';
import { EmptyHolder, IF } from '../../common';
import ViewControl from './control';
import ViewMask from '../../charts/chart-mask';
import './index.scss';


// tslint:disable-next-line: no-use-before-declare
interface IProps extends ReturnType<typeof mapStateToProps> {
  viewId: string
  view: any
  children: ReactElement<any>
  setViewInfo(data: object): void;
  editView(viewId: string): void;
  deleteView(viewId: string): void;
}

interface IState {
  resData: any
  fetchStatus: Status;
  prevStaticData: any;
}

const enum Status {
  FETCH = 'fetch',
  MOCK = 'mock',
  SUCCESS = 'success',
  FAIL = 'fail',
}
interface IMessage {
  fetchStatus: string
}
const getMessage = ({ fetchStatus }: IMessage): string => {
  if (fetchStatus === Status.MOCK) {
    return '模拟数据展示';
  }
  if (fetchStatus === Status.FETCH) {
    return '加载中';
  }
  if (fetchStatus === Status.FAIL) {
    return '数据获取失败';
  }
  return '';
};

class ChartOperation extends React.PureComponent<IProps, IState> {
  private hasLoadFn: boolean;

  private chartRef: React.ReactInstance;

  constructor(props: IProps) {
    super(props);
    const { view } = props;
    const { staticData, loadData } = view;
    this.hasLoadFn = typeof loadData === 'function';
    const initData = this.hasLoadFn ? {} : staticData;
    this.state = {
      resData: initData,
      fetchStatus: Status.SUCCESS,
      prevStaticData: {},
    };
  }

  static getDerivedStateFromProps(nextProps: IProps, prevState: any) {
    const staticData = get(nextProps, 'view.staticData');
    if (!isEqual(prevState.prevStaticData, staticData) && staticData) {
      return {
        resData: staticData,
        prevStaticData: staticData,
      };
    }
    return null;
  }

  componentDidMount() {
    if (this.hasLoadFn) {
      this.loadData(this.props.view.chartQuery);
    }
  }

  componentDidUpdate({ isEditView: prevIsEditView, view }: IProps) {
    this.hasLoadFn = typeof view.loadData === 'function';
    if (this.hasLoadFn) {
      console.log(this.props.view.chartQuery);
      if (!isEqual(this.props.view.chartQuery, view.chartQuery) || (prevIsEditView !== this.props.isEditView && prevIsEditView)) {
        this.loadData(this.props.view.chartQuery);
      }
    }
  }

  loadData = (arg?: any) => {
    const { view } = this.props;
    const { loadData, dataConvertor } = view;
    this.setState({
      fetchStatus: Status.FETCH,
    });
    loadData(arg)
      .then((res: any) => {
        let resData = res;
        if (dataConvertor) {
          let convertor = dataConvertor;
          if (isString(dataConvertor)) {
            convertor = getConfig(['dataConvertor', dataConvertor]);
            if (!convertor) {
              console.error(`dataConvertor \`${dataConvertor}\` not registered yet`);
              return;
            }
          }
          try {
            resData = convertor(res);
          } catch (error) {
            console.error('catch error in dataConvertor', error); // eslint-disable-line
          }
        }
        this.setState({
          fetchStatus: Status.SUCCESS,
          resData,
        });
      })
      .catch(() => {
        this.setState({ resData: {}, fetchStatus: Status.FAIL });
      });
  }

  onSaveImg = () => {
    saveImage(ReactDOM.findDOMNode(this.chartRef), this.props.viewId);  // eslint-disable-line
  }

  onSetScreenFull = () => {
    setScreenFull(ReactDOM.findDOMNode(this.chartRef), screenfull.isFullscreen); // eslint-disable-line
  }

  render() {
    const { view, children, isEditLayout, isEditView, viewId, editView, deleteView, setViewInfo } = this.props;
    const childNode = React.Children.only(children);
    const { resData, fetchStatus } = this.state;
    const message = getMessage({ fetchStatus });
    const { title, description } = view;

    return (
      <div className={classnames({ 'bi-view-wrapper': true, active: isEditView })}>
        <div className="header bi-chart-header">
          <h2 className="bi-chart-title">{title}</h2>
          <IF check={description}>
            <Tooltip title={description}>
              <Icon type="question-circle-o" />
            </Tooltip>
          </IF>
        </div>
        {
          !view.hideHeader &&
          (
            <div className="bi-view-header">
              <div className="bi-view-header-left">
                {
                  isEditLayout
                    ? <Input defaultValue={view.name} onClick={e => e.stopPropagation()} onBlur={e => setViewInfo({ viewId, name: e.target.value })} />
                    : <div className="bi-view-title">{view.name}</div>
                }
                {isEditLayout && <span className="bi-draggable-handle"><Icon type="drag" /></span>}
              </div>
              <div className="bi-view-header-right">
                <ViewControl view={view} viewId={viewId} loadData={this.loadData} />
                {this.hasLoadFn && !view.hideReload && <Icon className="reload-icon" type="reload" onClick={this.loadData} />}
              </div>
            </div>
          )
        }
        <ViewMask message={message} />
        {
          isEditLayout && (
            <div className="bi-view-edit-op">
              <Tooltip placement="bottom" title="编辑">
                <Icon type="edit" onClick={() => editView(viewId)} />
              </Tooltip>
              <Tooltip placement="bottom" title="删除">
                <Popconfirm
                  okText="确认"
                  cancelText="取消"
                  placement="top"
                  title="确认删除?"
                  onConfirm={() => deleteView(viewId)}
                >
                  <Icon type="delete" />
                </Popconfirm>
              </Tooltip>
              <Tooltip placement="bottom" title="导出图片">
                <Icon type="camera" onClick={this.onSaveImg} />
              </Tooltip>
              <Tooltip placement="bottom" title="图表全屏">
                <Icon type="arrows-alt" onClick={this.onSetScreenFull} />
              </Tooltip>
            </div>
          )
        }

        {
          isEmpty(resData.metricData) ?
            <EmptyHolder />
            :
            <div className="bi-chart" ref={(ref) => { this.chartRef = ref; }}>
              {
                React.cloneElement(childNode, {
                  ...childNode.props,
                  data: resData,
                  config: view.config,
                })
              }
            </div>
          // <IF check={isEmpty(resData.metricData)}>

            // <IF.ELSE />
          // </IF>
        }

      </div>
    );
  }
}

const mapStateToProps = (
  {
    dashBoard: { isEditMode: isEditLayout },
    chartEditor: { editChartId },
  }: any
  , { viewId }: any
) => ({
  isEditLayout,
  isEditView: editChartId === viewId,
});
const mapDispatchToProps = (dispatch: any) => ({
  setViewInfo(payload: any) {
    return dispatch({ type: 'chartEditor/updateViewInfo', payload });
  },
  editView(viewId: string) {
    return dispatch({ type: 'chartEditor/editView', payload: viewId });
  },
  deleteView(viewId: string) {
    return dispatch({ type: 'dashBoard/deleteView', viewId });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartOperation);
