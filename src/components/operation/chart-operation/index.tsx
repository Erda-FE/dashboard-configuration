import { Icon, Popconfirm, Tooltip } from 'antd';
import classnames from 'classnames';
import { isEmpty, isString, isEqual, get, isFunction } from 'lodash';
import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import screenfull from 'screenfull';
import { getConfig } from '../../../config';
import { saveImage, setScreenFull } from '../../../utils/comp';
import { EmptyHolder, IF } from '../../common';
import ViewControl from './control';
import ViewMask from '../../charts/chart-mask';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';

import './index.scss';


// tslint:disable-next-line: no-use-before-declare
interface IProps {
  textMap: { [k: string]: string }
  viewId: string
  view: any
  chartEditorVisible: boolean;
  isEditMode: boolean;
  isEditView: boolean;
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
        resData: staticData || {},
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
      if (
        !isEqual(this.props.view.chartQuery, view.chartQuery) ||
        (prevIsEditView !== this.props.isEditView && prevIsEditView) ||
        !isEqual(this.props.view.loadData, view.loadData)
      ) {
        this.loadData(this.props.view.chartQuery);
      }
    }
  }

  loadData = (arg?: any) => {
    const { view } = this.props;
    const { loadData, dataConvertor } = view;
    if (!isFunction(loadData)) return;
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
    const { viewId, textMap } = this.props;
    saveImage(ReactDOM.findDOMNode(this.chartRef), viewId, textMap);  // eslint-disable-line
  }

  onSetScreenFull = () => {
    setScreenFull(ReactDOM.findDOMNode(this.chartRef), screenfull.isFullscreen); // eslint-disable-line
  }

  getMessage = ({ fetchStatus }: IMessage): string => {
    const { textMap } = this.props;

    if (fetchStatus === Status.MOCK) {
      return textMap['show mock data'];
    }
    if (fetchStatus === Status.FETCH) {
      return textMap.loading;
    }
    if (fetchStatus === Status.FAIL) {
      return textMap['failed to get data'];
    }
    return '';
  }

  render() {
    const { view, children, isEditMode, isEditView, viewId, textMap, editView, deleteView, setViewInfo, chartEditorVisible } = this.props;
    const childNode = React.Children.only(children);
    const { resData, fetchStatus } = this.state;
    const message = this.getMessage({ fetchStatus });
    const { title: _title, description: _description, hideHeader = true } = view;
    const title = isFunction(_title) ? _title() : _title;
    const description = isFunction(_description) ? _description() : _description;

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
          !hideHeader &&
          (
            <div className="bi-view-header">
              {/* <div className="bi-view-header-left">
                {
                  isEditMode
                    ? <Input defaultValue={view.name} onClick={e => e.stopPropagation()} onBlur={e => setViewInfo({ viewId, name: e.target.value })} />
                    : <div className="bi-view-title">{view.name}</div>
                }
              </div> */}
              <div className="bi-view-header-right">
                <ViewControl view={view} viewId={viewId} loadData={this.loadData} />
                {this.hasLoadFn && !view.hideReload && <Icon className="reload-icon" type="reload" onClick={this.loadData} />}
              </div>
            </div>
          )
        }
        <ViewMask message={message} />
        <div className="dc-view-edit-op">
          {
            isEditMode && !chartEditorVisible && (
              <div>
                <Tooltip title={textMap.edit}>
                  <Icon type="edit" onClick={() => editView(viewId)} />
                </Tooltip>
                <Tooltip title={textMap.delete}>
                  <Popconfirm
                    okText={textMap.delete}
                    cancelText={textMap.cancel}
                    placement="top"
                    title={textMap['confirm to delete']}
                    onConfirm={() => deleteView(viewId)}
                  >
                    <Icon type="delete" />
                  </Popconfirm>
                </Tooltip>
                <Tooltip title={textMap['export picture']}>
                  <Icon type="camera" onClick={this.onSaveImg} />
                </Tooltip>
                <Tooltip title={textMap.fullscreen}>
                  <Icon type="arrows-alt" onClick={this.onSetScreenFull} />
                </Tooltip>
              </div>
            )
          }
          {
            isEditMode && (
              <Tooltip title={textMap.move}>
                <Icon className="dc-draggable-handle" type="drag" />
              </Tooltip>
            )
          }
        </div>
        {
          (!resData || isEmpty(resData.metricData)) ?
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
        }

      </div>
    );
  }
}

export default (p: any) => {
  const [isEditMode, textMap] = DashboardStore.useStore(s => [s.isEditMode, s.textMap]);
  const [editChartId, viewMap] = ChartEditorStore.useStore(s => [s.editChartId, s.viewMap]);
  const { updateViewInfo: setViewInfo, editView } = ChartEditorStore;
  const { deleteView } = DashboardStore;
  const chartEditorVisible = !isEmpty(viewMap[editChartId]);
  const props = {
    isEditMode,
    textMap,
    chartEditorVisible,
    isEditView: editChartId === p.viewId,
    setViewInfo,
    editView,
    deleteView,
  };
  return <ChartOperation {...props} {...p} />;
};
