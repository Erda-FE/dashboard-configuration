import { Popconfirm, Tooltip, Dropdown, Menu, Select } from 'antd';
import classnames from 'classnames';
import { isEmpty, isString, isEqual, get, isFunction, map } from 'lodash';
import React, { ReactElement } from 'react';
import { getConfig } from '../../config';
import { saveImage, setScreenFull } from '../../utils/comp';
import { EmptyHolder, IF } from '../../common';
import ViewMask from '../views/chart-mask';
import ChartEditorStore from '../../stores/chart-editor';
import DashboardStore from '../../stores/dash-board';
// import Control from './control';
import { DcIcon } from '../Icon';

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

class Operation extends React.PureComponent<IProps, IState> {
  private hasLoadFn: boolean;

  private chartRef: HTMLDivElement | null;

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
    saveImage(this.chartRef, viewId, textMap);
  }

  onSetScreenFull = () => {
    setScreenFull(this.chartRef);
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
    const { view, children, isEditMode, isEditView, viewId, textMap, editView, deleteView, chartEditorVisible } = this.props;
    const childNode = React.Children.only(children);
    const { resData, fetchStatus } = this.state;
    const { title: _title, description: _description, hideHeader = false, maskMsg, controls = [] } = view;
    const message = this.getMessage({ fetchStatus }) || maskMsg;
    const isCustomTitle = isFunction(_title);
    const title = isCustomTitle ? _title() : _title;
    const description = isFunction(_description) ? _description() : _description;
    const optionsMenu = (
      <Menu>
        <Menu.Item key="0">
          <a className="dc-chart-title-dp-op" onClick={() => editView(viewId)}>
            <DcIcon type="edit" />{textMap.edit}
          </a>
        </Menu.Item>
        <Menu.Item key="1">
          <Popconfirm
            okText={textMap.delete}
            cancelText={textMap.cancel}
            placement="top"
            title={textMap['confirm to delete']}
            onConfirm={() => deleteView(viewId)}
          >
            <a className="dc-chart-title-dp-op">
              <DcIcon type="delete" />{textMap.delete}
            </a>
          </Popconfirm>
        </Menu.Item>
        <Menu.Item key="2">
          <a className="dc-chart-title-dp-op" onClick={this.onSaveImg}>
            <DcIcon type="camera" />{textMap.export}
          </a>
        </Menu.Item>
        <Menu.Item key="3">
          <a className="dc-chart-title-dp-op" onClick={this.onSetScreenFull}>
            <DcIcon type="fullscreen" />{textMap.fullscreen}
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={classnames({ 'dc-view-wrapper': true, active: isEditView })}>
        <IF check={!hideHeader || isEditMode}>
          <div className="dc-chart-header">
            <IF check={isCustomTitle}>
              <React.Fragment>{title}</React.Fragment>
              <IF.ELSE />
              <Dropdown
                disabled={!isEditMode || chartEditorVisible}
                overlay={optionsMenu}
              >
                <div className={classnames({ 'dc-chart-title-ct': true, pointer: isEditMode })}>
                  <h2 className="dc-chart-title">{title}</h2>
                  <IF check={description}>
                    <Tooltip title={description}>
                      <DcIcon type="info-circle" className="dc-chart-title-op" />
                    </Tooltip>
                  </IF>
                  <IF check={isEditMode && !chartEditorVisible}>
                    <DcIcon type="setting" className="dc-chart-title-op" />
                  </IF>
                </div>
              </Dropdown>
              <React.Fragment>
                {
                  !isEmpty(controls[0]) && controls[0].key && !isEmpty(controls[0].options) && controls[0].type === 'select'
                    ?
                      <div className="dc-chart-controls-ct">
                        <Select
                          className="my12"
                          style={{ width: 150 }}
                          onChange={(v: any) => {
                            // this.loadData();
                          }}
                        >
                          { map(controls[0].options, item => <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>) }
                        </Select>
                      </div>
                    :
                    null
                }
              </React.Fragment>
            </IF>
          </div>
        </IF>
        <IF check={isEditMode && !chartEditorVisible}>
          <Tooltip title={textMap.move}><DcIcon type="drag" className="dc-draggable-handle" /></Tooltip>
        </IF>
        <ViewMask message={message} />
        {/* <Control view={view} viewId={viewId} loadData={this.loadData} /> */}
        {
          (typeof view.customRender !== 'function' && (!resData || isEmpty(resData.metricData)))
            ? <EmptyHolder />
            : (
              <div className="dc-chart" ref={(ref) => { this.chartRef = ref; }}>
                {
                  React.cloneElement(childNode, {
                    ...childNode.props,
                    data: resData,
                    config: view.config,
                  })
                }
              </div>
            )
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
  return <Operation {...props} {...p} />;
};
