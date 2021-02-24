/* provide state-Container for Charts
 * @Author: licao
 * @Date: 2020-12-04 16:32:38
 * @Last Modified by: licao
 * @Last Modified time: 2021-02-24 16:00:10
 */
import React, { ReactElement, useRef, useEffect, useCallback } from 'react';
import { Tooltip, Select, Toast, Button } from '@terminus/nusi';
import classnames from 'classnames';
import { isEmpty, get, isFunction, reduce, isString, map, merge } from 'lodash';
import { Choose, When, Otherwise, If } from 'tsx-control-statements/components';
import { useUpdate, DcIcon, DcEmpty } from '../../common';
import { replaceVariable } from '../../common/utils';
import { getConfig } from '../../config';
import { FetchStatus } from './constants';
import ViewDropdownOptions from './options';
import { ChartMask, ChartSpinMask } from '../DcCharts/common';
import { createLoadDataFn } from '../DcChartEditor/data-config/dice-form/data-loader';
// DcDashboard 里面发起的请求,需要提供配置
import { getChartData } from '../../services/chart-editor';
import ChartEditorStore from '../../stores/chart-editor';
import DashboardStore from '../../stores/dash-board';

import './index.scss';
import { DC } from 'src/types';

const textMap = DashboardStore.getState((s) => s.textMap);
const excludeEmptyType = ['chart:map'];

interface IProps {
  viewId: string;
  view: DC.View;
  children: ReactElement<any>;
  isPure?: boolean;
}
const DcContainer = ({ view, viewId, children, isPure }: IProps) => {
  const [fromPureFullscreenStatus, globalVariable] = DashboardStore.useStore((s) => [s.isFullscreen, s.globalVariable]);
  const [editChartId, fromEditorFullscreenStatus, isEditMode] = ChartEditorStore.useStore((s) => [s.editChartId, s.isFullscreen, s.isEditMode]);
  const { toggleFullscreen: togglePureFullscreen } = DashboardStore;
  const { toggleFullscreen: toggleFromEditorPureFullscreen, editView } = ChartEditorStore;
  const isFullscreen = isPure ? fromPureFullscreenStatus : fromEditorFullscreenStatus;
  const toggleFullscreen = isPure ? togglePureFullscreen : toggleFromEditorPureFullscreen;

  const {
    title: _title,
    description: _description,
    chartType,
    hideHeader = false,
    maskMsg,
    controls = [],
    config,
    api,
    staticData,
    dataConvertor,
    chartQuery,
    loadData: propLoadData,
    customRender,
  } = view;

  const chartEditorVisible = !!editChartId;
  const childNode = React.Children.only(children);
  const dataConfigSelectors = get(api, ['extraData', 'dataConfigSelectors']);
  const dynamicFilterKey = get(api, ['extraData', 'dynamicFilterKey']);
  const dynamicFilterDataAPI = get(api, ['extraData', 'dynamicFilterDataAPI']);

  const isCustomTitle = isFunction(_title);
  const title = isCustomTitle ? (_title as Function)() : _title;
  const description = isFunction(_description) ? _description() : _description;
  const isCustomRender = isFunction(customRender);
  const isShowOptions = !chartEditorVisible && !isFullscreen;

  const [{
    resData,
    fetchStatus,
    staticLoadFnPayload,
    dynamicLoadFnPayloadMap,
    dynamicFilterData,
    loadData,
  }, updater, update] = useUpdate({
    resData: {},
    fetchStatus: FetchStatus.NONE,
    staticLoadFnPayload: {},
    dynamicLoadFnPayloadMap: {},
    dynamicFilterData: [],
    loadData: propLoadData,
  });
  const viewRef = useRef<HTMLDivElement>(null);

  // 初始化 static data
  useEffect(() => {
    updater.resData((isFunction(loadData) ? {} : staticData) as DC.StaticData);
  }, [loadData, staticData, updater]);

  const _loadData = useCallback((arg?: any, body?: any) => {
    if (!isFunction(loadData)) return;
    updater.fetchStatus(FetchStatus.FETCH);
    // 调用外部传入的函数
    loadData({
      ...reduce(dynamicLoadFnPayloadMap, (result, v) => ({ ...result, ...v }), {}),
      ...staticLoadFnPayload,
      ...arg,
    }, body)
      .then((res: any) => {
        let _res = res;
        if (dataConvertor) {
          let convertor = dataConvertor;
          // 取已经注册的 Data Convertor
          if (isString(dataConvertor)) {
            convertor = getConfig(['dataConvertor', dataConvertor]);
            if (!convertor) {
            // eslint-disable-next-line no-console
              console.error(`dataConvertor \`${dataConvertor}\` not registered yet`);
              return () => {};
            }
          }

          try {
            _res = (convertor as Function)(res);
          } catch (error) {
          console.error('catch error in dataConvertor', error); // eslint-disable-line
          }
        }

        update({
          fetchStatus: FetchStatus.SUCCESS,
          resData: _res,
        });
      })
      .catch((err) => {
        if (err.status === 400) {
          Toast.warning(textMap['config err'], 1);
          update({
            resData: undefined,
            fetchStatus: FetchStatus.SUCCESS,
          });
        } else {
          update({
            resData: undefined,
            fetchStatus: FetchStatus.FAIL,
          });
        }
      });
  }, [dataConvertor, dynamicLoadFnPayloadMap, loadData, staticLoadFnPayload, update, updater]);

  const _childNode = React.cloneElement(childNode, {
    ...childNode.props,
    data: resData,
    config,
    api,
    isEditView: chartEditorVisible,
    loadData: _loadData,
  });

  const loadDynamicFilterData = useCallback(() => {
    const _dynamicFilterDataAPI = get(api, ['extraData', 'dynamicFilterDataAPI']);
    if (!isEmpty(_dynamicFilterDataAPI)) {
      const start = api?.query?.start;
      const end = api?.query?.end;
      getChartData(merge({}, _dynamicFilterDataAPI, { query: { start, end } })).then(({ data }: any) => {
        if (isEmpty(data)) return;
        const { cols, data: _data } = data;
        if (cols[0] && !isEmpty(_data)) {
          const _dynamicFilterData = map(_data, (item) => ({
            value: item[cols[0].key],
            name: item[cols[0].key],
          }));
          updater.dynamicFilterData(_dynamicFilterData);
        }
      });
    }
  }, [api, updater]);

  // init loadData
  useEffect(() => {
    if (!!api && !isEmpty(api) && !loadData) {
      updater.loadData(createLoadDataFn({
        api: replaceVariable(api, globalVariable),
        chartType,
        ...(get(view, 'config.dataSourceConfig') || {}),
      }));
    }
  }, [api, chartType, globalVariable, loadData, updater, view]);

  useEffect(() => {
    if (isFunction(loadData)) {
      _loadData(chartQuery);
      loadDynamicFilterData();
    }
  }, [chartQuery, _loadData, loadDynamicFilterData, loadData]);

  const getTitle = () => (
    <div className="dc-chart-title-ct pointer">
      <h2 className="dc-chart-title px12">{title}</h2>
      <If condition={description}>
        <Tooltip title={description}>
          <DcIcon type="info-circle" className="dc-chart-title-op" />
        </Tooltip>
      </If>
    </div>
  );

  const getHeader = () => (
    <div className={classnames({
      'dc-chart-header': true,
      'cursor-move': isEditMode && !chartEditorVisible,
      active: isEditMode && !chartEditorVisible,
    })}
    >
      <Choose>
        <When condition={isCustomTitle}>
          <React.Fragment>{React.Children.only(title)}</React.Fragment>
        </When>
        <Otherwise>
          <div className="flex-box">
            <h2 className="dc-chart-title px12">{title}</h2>
            <div className={classnames({ 'dc-chart-options': true, 'visibility-hidden': !isEditMode })}>
              <If condition={isEditMode && isShowOptions}>
                <Tooltip title={textMap['config charts']}>
                  <Button type="text" onClick={() => editView(viewId)}><DcIcon type="edit" /></Button>
                </Tooltip>
              </If>
              <If condition={description}>
                <Tooltip title={description}>
                  <Button type="text"><DcIcon type="info-circle" /></Button>
                </Tooltip>
              </If>
              <ViewDropdownOptions
                view={view}
                viewId={viewId}
                viewRef={viewRef}
                disabled={isFullscreen || chartEditorVisible}
                toggleFullscreen={toggleFullscreen}
              >
                <Button type="text"><DcIcon type="more" /></Button>
              </ViewDropdownOptions>
            </div>
          </div>
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
                  size="small"
                  allowClear
                  className="my12 ml8"
                  style={{ width: 150 }}
                  onChange={(v: any) => {
                    updater.staticLoadFnPayload({
                      [controls[0].key]: v,
                    });
                  }}
                >
                  { map(controls[0].options, (item) => <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>) }
                </Select>
              </If>
              <If condition={!isEmpty(dataConfigSelectors)}>
                {
                  map(dataConfigSelectors, ({ key, options, componentProps }) => (
                    <Select
                      size="small"
                      key={key}
                      className="my12 ml8"
                      style={{ width: 150 }}
                      onChange={(v: any) => {
                        updater.dynamicLoadFnPayloadMap({
                          ...dynamicLoadFnPayloadMap,
                          [key]: JSON.parse(v),
                        });
                      }}
                      {...componentProps}
                    >
                      { map(options, (item) => <Select.Option value={item.value} key={item.value}>{item.name}</Select.Option>) }
                    </Select>
                  ))
                }
              </If>
              <If condition={dynamicFilterKey && !isEmpty(dynamicFilterDataAPI)}>
                <Select
                  size="small"
                  allowClear
                  className="my12 ml8"
                  style={{ width: 150 }}
                  onChange={(v: any) => {
                    updater.dynamicLoadFnPayloadMap({
                      ...dynamicLoadFnPayloadMap,
                      'dynamic-data': { [`filter_${dynamicFilterKey.split('-')[1]}`]: v },
                    });
                  }}
                >
                  {
                    map(dynamicFilterData, (item) => (
                      <Select.Option
                        value={item.value}
                        key={item.value}
                      >
                        {item.name}
                      </Select.Option>
                    ))
                  }
                </Select>
              </If>
            </div>
          </If>
        </Otherwise>
      </Choose>
    </div>
  );

  const getViewMask = (msg?: string | Element) => {
    let _msg = msg;
    let viewMask;
    if (_msg === FetchStatus.FETCH) {
      viewMask = <ChartSpinMask message={`${textMap.loading}...`} />;
    } else {
      switch (_msg) {
        case FetchStatus.MOCK:
          _msg = textMap['show mock data'];
          break;
        case FetchStatus.FAIL:
          _msg = textMap['failed to get data'];
          break;
        case FetchStatus.SUCCESS:
          _msg = '';
          break;
        default:
          break;
      }
      viewMask = <ChartMask message={_msg} />;
    }

    return viewMask;
  };

  return (
    <div ref={viewRef} className="dc-view-wrapper">
      <If condition={!hideHeader || isEditMode}>{getHeader()}</If>
      {getViewMask(fetchStatus || maskMsg)}
      <Choose>
        <When
          condition={
            !isCustomRender
            && !excludeEmptyType.includes(chartType)
            && (!resData || isEmpty(resData?.metricData))
          }
        >
          <DcEmpty className="full-height" />
        </When>
        <Otherwise>
          <div className="dc-chart">
            <Choose>
              <When condition={isCustomRender}>
                {(customRender as Function)((!resData || isEmpty(resData.metricData)) ? <DcEmpty /> : _childNode, view)}
              </When>
              <Otherwise>{_childNode}</Otherwise>
            </Choose>
          </div>
        </Otherwise>
      </Choose>
    </div>
  );
};

export default DcContainer;
