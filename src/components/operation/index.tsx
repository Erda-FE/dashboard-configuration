import { Popconfirm, Tooltip, Dropdown, Menu, Select } from 'antd';
import classnames from 'classnames';
import { isEmpty, isString, isEqual, get, isFunction, map } from 'lodash';
import React, { ReactElement } from 'react';
import { getConfig } from '../../config';
import { saveImage, setScreenFull } from '../../utils/comp';
import { EmptyHolder, IF } from '../../common';
import ChartMask, { ChartSpinMask } from '../views/chart-mask';
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
  NONE = '',
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
      fetchStatus: Status.NONE,
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

  componentDidUpdate({ isEditView, view }: IProps) {
    this.hasLoadFn = typeof view.loadData === 'function';
    const isChartQueryUpdated = !isEqual(this.props.view.chartQuery, view.chartQuery);
    const isEditViewUpdated = isEditView !== this.props.isEditView && isEditView;
    const isLoadDataUpdated = !isEqual(this.props.view.loadData, view.loadData);

    if (this.hasLoadFn && (isChartQueryUpdated || isEditViewUpdated || isLoadDataUpdated)) {
      this.loadData(this.props.view.chartQuery);
    }
  }

  loadData = (arg?: any) => {
    const { view } = this.props;
    const { loadData, dataConvertor } = view;
    if (!isFunction(loadData)) return;
    this.setState({
      fetchStatus: Status.FETCH,
    });
    // 调用外部传入的函数
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

  getViewMask = (msg?: string): JSX.Element => {
    let _msg = msg;
    let viewMask;
    const { textMap } = this.props;

    if (_msg === Status.FETCH) {
      viewMask = <ChartSpinMask message={`${textMap.loading}...`} />;
    } else {
      switch (_msg) {
        case Status.MOCK:
          _msg = textMap['show mock data'];
          break;
        case Status.FAIL:
          _msg = textMap['failed to get data'];
          break;
        case Status.SUCCESS:
          _msg = '';
          break;
        default:
          break;
      }
      viewMask = <ChartMask message={_msg} />;
    }

    return viewMask;
  }

  render() {
    const { view, children, isEditMode, isEditView, viewId, textMap, editView, deleteView, chartEditorVisible } = this.props;
    const childNode = React.Children.only(children);
    const { resData, fetchStatus } = this.state;
    const { title: _title, description: _description, hideHeader = false, maskMsg, controls = [], customRender, config, chartType } = view;
    const isCustomTitle = isFunction(_title);
    const title = isCustomTitle ? _title() : _title;
    const description = isFunction(_description) ? _description() : _description;
    const isCustomRender = typeof customRender === 'function';
    const excludeEmptyType = ['chart:map'];
    const _childNode = React.cloneElement(childNode, {
      ...childNode.props,
      data: resData,
      config,
      loadData: this.loadData,
    });

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
                  controls && !isEmpty(controls[0]) && controls[0].key && !isEmpty(controls[0].options) && controls[0].type === 'select'
                    ?
                      <div className="dc-chart-controls-ct">
                        <Select
                          allowClear
                          className="my12"
                          style={{ width: 150 }}
                          onChange={(v: any) => {
                            this.loadData({ [controls[0].key]: v });
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
        {this.getViewMask(fetchStatus || maskMsg)}
        {/* <Control view={view} viewId={viewId} loadData={this.loadData} /> */}
        {
          (!isCustomRender && !excludeEmptyType.includes(chartType) && (!resData || isEmpty(resData.metricData)))
            ? <EmptyHolder />
            : (
              <div className="dc-chart" ref={(ref) => { this.chartRef = ref; }}>
                {isCustomRender ? customRender(_childNode, view) : _childNode}
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
