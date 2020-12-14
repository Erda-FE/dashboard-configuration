import { Tooltip, Select } from 'antd';
import classnames from 'classnames';
import { isEmpty, isString, isEqual, get, isFunction, map, reduce, merge } from 'lodash';
import React, { ReactElement } from 'react';
import { Choose, When, Otherwise, If } from 'tsx-control-statements/components';
import { getConfig } from '../../config';
import { EmptyHolder, DcIcon } from '../../common';
import { ChartMask, ChartSpinMask } from '../DcCharts/common';
import ViewDropdownOptions from './options';
import ChartEditorStore from '../../stores/chart-editor';
import DashboardStore from '../../stores/dash-board';
// import Control from './control';
// DcDashboard 里面发起的请求,需要提供配置
import { getChartData } from '../../services/chart-editor';

import './index.scss';

interface IProps {
  textMap: { [k: string]: string };
  viewId: string;
  view: any;
  chartEditorVisible: boolean;
  isFullscreen: boolean;
  isEditMode: boolean;
  isEditView: boolean;
  children: ReactElement<any>;
  setViewInfo: (data: object) => void;
  editView: (viewId: string) => void;
}

// eslint-disable-next-line no-shadow
enum Status {
  FETCH = 'fetch',
  MOCK = 'mock',
  SUCCESS = 'success',
  FAIL = 'fail',
  NONE = '',
}

interface IState {
  resData: any;
  fetchStatus: Status;
  prevStaticData: any;
  // 传给loadData的参数
  staticLoadFnPayload: any;
  dynamicLoadFnPayloadMap: any;
  dynamicFilterData: any[];
}

class Operation extends React.PureComponent<IProps, IState> {
  private hasLoadFn: boolean;

  private chartRef: HTMLDivElement | null;

  private exportingData: any = null;

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
      staticLoadFnPayload: {},
      dynamicLoadFnPayloadMap: {},
      dynamicFilterData: [],
    };
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
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
      this.loadDynamicFilterData();
    }
  }

  componentDidUpdate({ isEditView, view }: IProps) {
    this.hasLoadFn = typeof view.loadData === 'function';
    const isChartQueryUpdated = !isEqual(this.props.view.chartQuery, view.chartQuery);
    const isEditViewUpdated = isEditView !== this.props.isEditView && isEditView;
    const isLoadDataUpdated = !isEqual(this.props.view.loadData, view.loadData);

    if (this.hasLoadFn && (isChartQueryUpdated || isEditViewUpdated || isLoadDataUpdated)) {
      this.loadData(this.props.view.chartQuery);
      this.loadDynamicFilterData();
    }
  }

  loadDynamicFilterData() {
    const dynamicFilterDataAPI = get(this.props.view, ['api', 'extraData', 'dynamicFilterDataAPI']);
    if (!isEmpty(dynamicFilterDataAPI)) {
      const { start, end } = get(this.props.view, ['api', 'query']);
      const _this = this;
      getChartData(merge({}, dynamicFilterDataAPI, { query: { start, end } })).then(({ data }: any) => {
        if (isEmpty(data)) return;
        const { cols, data: _data } = data;
        if (cols[0] && !isEmpty(_data)) {
          const dynamicFilterData = map(_data, (item) => ({
            value: item[cols[0].key],
            name: item[cols[0].key],
          }));
          _this.setState({ dynamicFilterData });
        }
      });
    }
  }

  loadData = (arg?: any, body?: any) => {
    const { view } = this.props;
    const { loadData, dataConvertor } = view;
    const { staticLoadFnPayload, dynamicLoadFnPayloadMap } = this.state;
    if (!isFunction(loadData)) return;
    this.setState({
      fetchStatus: Status.FETCH,
    });
    // 调用外部传入的函数
    loadData({
      ...reduce(dynamicLoadFnPayloadMap, (result, v) => ({ ...result, ...v }), {}),
      ...staticLoadFnPayload,
      ...arg,
    }, body).then((res: any) => {
      let resData = res;
      if (dataConvertor) {
        let convertor = dataConvertor;
        if (isString(dataConvertor)) {
          convertor = getConfig(['dataConvertor', dataConvertor]);
          if (!convertor) {
            // eslint-disable-next-line no-console
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
    }).catch(() => {
      this.setState({ resData: {}, fetchStatus: Status.FAIL });
    });
  };

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
  };

  render() {
    const { view, children, isEditMode, isEditView, viewId, textMap, chartEditorVisible, isFullscreen } = this.props;
    const childNode = React.Children.only(children);
    const { resData, fetchStatus, dynamicLoadFnPayloadMap, dynamicFilterData } = this.state;
    const { title: _title, description: _description, hideHeader = false, maskMsg, controls = [], customRender, config, chartType, api } = view;
    const dataConfigSelectors = get(api, ['extraData', 'dataConfigSelectors']);
    const dynamicFilterKey = get(api, ['extraData', 'dynamicFilterKey']);
    const dynamicFilterDataAPI = get(api, ['extraData', 'dynamicFilterDataAPI']);
    const isCustomTitle = isFunction(_title);
    const title = isCustomTitle ? _title() : _title;
    const description = isFunction(_description) ? _description() : _description;
    const isCustomRender = typeof customRender === 'function';
    const excludeEmptyType = ['chart:map'];
    const _childNode = React.cloneElement(childNode, {
      ...childNode.props,
      data: resData,
      config,
      isEditView,
      loadData: this.loadData,
    });

    return (
      <div className={classnames({ 'dc-view-wrapper': true, active: isEditView })}>
        <If condition={!hideHeader || isEditMode}>
          <div className="dc-chart-header">
            <Choose>
              <When condition={isCustomTitle}><React.Fragment>{title}</React.Fragment></When>
              <Otherwise>
                <ViewDropdownOptions
                  view={view}
                  viewId={viewId}
                  viewRef={{ current: this.chartRef }}
                >
                  <div className={classnames({ 'dc-chart-title-ct': true, pointer: true })}>
                    <h2 className="dc-chart-title">{title}</h2>
                    <If condition={description}>
                      <Tooltip title={description}>
                        <DcIcon type="info-circle" className="dc-chart-title-op" />
                      </Tooltip>
                    </If>
                    <If condition={!chartEditorVisible && !isFullscreen}>
                      <DcIcon type="down" className="dc-chart-title-op" />
                    </If>
                  </div>
                </ViewDropdownOptions>
                <React.Fragment>
                  <If
                    condition={
                      (controls && !isEmpty(controls[0]))
                      || !isEmpty(dataConfigSelectors)
                      || (dynamicFilterKey && !isEmpty(dynamicFilterDataAPI))
                    }
                  >
                    <div className="dc-chart-controls-ct">
                      <If
                        condition={
                          !isEmpty(controls[0])
                          && controls[0].key
                          && !isEmpty(controls[0].options)
                          && controls[0].type === 'select'
                        }
                      >
                        <Select
                          allowClear
                          className="my12 ml8"
                          style={{ width: 150 }}
                          onChange={(v: any) => {
                            this.setState({
                              staticLoadFnPayload: {
                                [controls[0].key]: v,
                              },
                            }, () => {
                              this.loadData();
                            });
                          }}
                        >
                          { map(controls[0].options, (item) => <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>) }
                        </Select>
                      </If>
                      {/* 多指标选择 */}
                      <If condition={!isEmpty(dataConfigSelectors)}>
                        {
                          map(dataConfigSelectors, ({ key, options, componentProps }) => (
                            <Select
                              key={key}
                              // defaultValue={options[0].value}
                              className="my12 ml8"
                              style={{ width: 150 }}
                              onChange={(v: any) => {
                                this.setState({
                                  dynamicLoadFnPayloadMap: {
                                    ...dynamicLoadFnPayloadMap,
                                    [key]: JSON.parse(v),
                                  },
                                }, () => {
                                  this.loadData();
                                });
                              }}
                              {...componentProps}
                            >
                              { map(options, (item) => <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>) }
                            </Select>
                          ))
                        }
                      </If>
                      {/* 动态过滤 */}
                      <If condition={dynamicFilterKey && !isEmpty(dynamicFilterDataAPI)}>
                        <Select
                          allowClear
                          className="my12 ml8"
                          style={{ width: 150 }}
                          onChange={(v: any) => {
                            this.setState({
                              dynamicLoadFnPayloadMap: {
                                ...dynamicLoadFnPayloadMap,
                                'dynamic-data': { [`filter_${dynamicFilterKey.split('-')[1]}`]: v },
                              },
                            }, () => {
                              this.loadData();
                            });
                          }}
                        >
                          { map(dynamicFilterData, (item) => <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>) }
                        </Select>
                      </If>
                    </div>
                  </If>
                </React.Fragment>
              </Otherwise>
            </Choose>
          </div>
        </If>
        <If condition={isEditMode && !chartEditorVisible}>
          <Tooltip title={textMap.move}><DcIcon type="drag" className="dc-draggable-handle" /></Tooltip>
        </If>
        {this.getViewMask(fetchStatus || maskMsg)}
        {/* <Control view={view} viewId={viewId} loadData={this.loadData} /> */}
        <Choose>
          <When
            condition={
              !isCustomRender
              && !excludeEmptyType.includes(chartType)
              && (!resData || isEmpty(resData.metricData))
            }
          >
            <EmptyHolder />
          </When>
          <Otherwise>
            {/* 自定义渲染 */}
            <div className="dc-chart" ref={(ref) => { this.chartRef = ref; }}>
              <Choose>
                <When condition={isCustomRender}>
                  {customRender((!resData || isEmpty(resData.metricData)) ? <EmptyHolder /> : _childNode, view)}
                </When>
                <Otherwise>{_childNode}</Otherwise>
              </Choose>
            </div>
          </Otherwise>
        </Choose>
      </div>
    );
  }
}

export default (p: any) => {
  const [isEditMode, isFullscreen, textMap] = DashboardStore.useStore((s) => [s.isEditMode, s.isFullscreen, s.textMap]);
  const [editChartId, viewMap] = ChartEditorStore.useStore((s) => [s.editChartId, s.viewMap]);
  const { updateViewInfo: setViewInfo, editView } = ChartEditorStore;

  const chartEditorVisible = !isEmpty(viewMap[editChartId]);
  const props = {
    isEditMode,
    isFullscreen,
    textMap,
    chartEditorVisible,
    isEditView: editChartId === p.viewId,
    setViewInfo,
    editView,
  };
  return <Operation {...props} {...p} />;
};
