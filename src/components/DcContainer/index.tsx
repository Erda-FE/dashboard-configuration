/* provide state-Container for Charts
 * @Author: licao
 * @Date: 2020-12-04 16:32:38
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-14 23:18:19
 */
import React, { ReactElement, useRef, useEffect, useCallback } from 'react';
import { Tooltip, Select } from '@terminus/nusi';
import classnames from 'classnames';
import { isEmpty, get, isFunction, reduce, isString, map, merge } from 'lodash';
import { Choose, When, Otherwise, If } from 'tsx-control-statements/components';
import { useUpdate, DcIcon, DcEmpty } from '../../common';
import { getConfig } from '../../config';
import { FetchStatus } from './constants';
import ViewDropdownOptions from './options';
import { ChartMask, ChartSpinMask } from '../DcCharts/common';
// DcDashboard 里面发起的请求,需要提供配置
import { getChartData } from '../../services/chart-editor';

import ChartEditorStore from '../../stores/chart-editor';
import DashboardStore from '../../stores/dash-board';

import './index.scss';

const textMap = DashboardStore.getState((s) => s.textMap);
const excludeEmptyType = ['chart:map'];

interface IProps {
  viewId: string;
  view: DC.View;
  children: ReactElement<any>;
}
const DcContainer = ({ view, viewId, children }: IProps) => {
  const [isEditMode, isFullscreen] = DashboardStore.useStore((s) => [s.isEditMode, s.isFullscreen]);
  const [editChartId, viewMap] = ChartEditorStore.useStore((s) => [s.editChartId, s.viewMap]);

  const {
    title: _title,
    description: _description,
    hideHeader = false,
    maskMsg,
    controls = [],
    customRender,
    config,
    chartType,
    api,
    loadData,
    staticData,
    dataConvertor,
    chartQuery,
  } = view;

  const chartEditorVisible = !isEmpty(viewMap[editChartId]);
  const isEditView = editChartId === viewId;
  const childNode = React.Children.only(children);
  const hasLoadFn = isFunction(loadData);
  const dataConfigSelectors = get(api, ['extraData', 'dataConfigSelectors']);
  const dynamicFilterKey = get(api, ['extraData', 'dynamicFilterKey']);
  const dynamicFilterDataAPI = get(api, ['extraData', 'dynamicFilterDataAPI']);
  const isCustomTitle = isFunction(_title);
  const title = isCustomTitle ? (_title as Function)() : _title;
  const description = isFunction(_description) ? _description() : _description;
  const isCustomRender = isFunction(customRender);

  const [{
    resData,
    fetchStatus,
    staticLoadFnPayload,
    dynamicLoadFnPayloadMap,
    dynamicFilterData,
  }, updater, update] = useUpdate({
    resData: (hasLoadFn ? {} : staticData) as DC.StaticData,
    fetchStatus: FetchStatus.NONE,
    staticLoadFnPayload: {},
    dynamicLoadFnPayloadMap: {},
    dynamicFilterData: [],
  });
  const viewRef = useRef<HTMLDivElement>(null);

  const _childNode = React.cloneElement(childNode, {
    ...childNode.props,
    data: resData,
    config,
    isEditView,
    loadData,
  });

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
        let _resData = res;
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
            _resData = (convertor as Function)(res);
          } catch (error) {
          console.error('catch error in dataConvertor', error); // eslint-disable-line
          }
        }

        update({
          fetchStatus: FetchStatus.SUCCESS,
          resData: _resData,
        });
      })
      .catch(() => {
        update({
          resData: {},
          fetchStatus: FetchStatus.FAIL,
        });
      });
  }, [dataConvertor, dynamicLoadFnPayloadMap, loadData, staticLoadFnPayload, update, updater]);

  const loadDynamicFilterData = useCallback(() => {
    const _dynamicFilterDataAPI = get(api, ['extraData', 'dynamicFilterDataAPI']);
    if (!isEmpty(_dynamicFilterDataAPI)) {
      const { start, end } = get(api, ['query']);
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

  useEffect(() => {
    if (hasLoadFn) {
      _loadData(chartQuery);
      loadDynamicFilterData();
    }
  }, [_loadData, chartQuery, hasLoadFn, loadDynamicFilterData]);

  const getTitle = () => (
    <div className="dc-chart-title-ct pointer">
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
  );

  const getHeader = () => (
    <div className="dc-chart-header">
      <Choose>
        <When condition={isCustomTitle}>
          <React.Fragment>{React.Children.only(title)}</React.Fragment>
        </When>
        <Otherwise>
          <ViewDropdownOptions
            view={view}
            viewId={viewId}
            viewRef={viewRef}
          >
            {getTitle()}
          </ViewDropdownOptions>
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
    <div ref={viewRef} className={classnames({ 'dc-view-wrapper': true, active: isEditView })}>
      <If condition={!hideHeader || isEditMode}>{getHeader()}</If>
      <If condition={isEditMode && !chartEditorVisible}>
        <Tooltip title={textMap.move}>
          <DcIcon type="drag" className="dc-draggable-handle" />
        </Tooltip>
      </If>
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
