/* provide state-Container for Charts
 * @Author: licao
 * @Date: 2020-12-04 16:32:38
 * @Last Modified by: licao
 * @Last Modified time: 2021-04-22 14:07:06
 */
import React, { ReactElement, useRef, useEffect, useCallback } from 'react';
import { Button, Tooltip, Select, message } from 'antd';
import classnames from 'classnames';
import { isEmpty, get, isFunction, reduce, isString, map, merge } from 'lodash';
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
import DC from 'src/types';

const excludeEmptyType = ['chart:map'];

interface IProps {
  viewId: string;
  view: DC.View;
  children: ReactElement<any>;
  isPure?: boolean; // 由于 DcContainer 组件是 PureBoardGrid 和 BoardGrid 共用，有些 Store 中的状态需要区分
  globalVariable?: Record<string, any>;
  onBoardEvent?: DC.onBoardEvent;
}
const DcContainer: React.FC<IProps> = ({
  view,
  viewId,
  children,
  isPure,
  globalVariable,
  onBoardEvent,
}) => {
  // 全屏状态区分 Pure 和非 Pure
  const fromPureFullscreenStatus = DashboardStore.useStore((s) => s.isFullscreen);
  const [
    editChartId,
    fromEditorFullscreenStatus,
    isEditMode,
  ] = ChartEditorStore.useStore((s) => [s.editChartId, s.isFullscreen, s.isEditMode, s.canSave]);
  const { toggleFullscreen: togglePureFullscreen } = DashboardStore;
  const { toggleFullscreen: toggleFromEditorPureFullscreen, editView, checkBeforeSave } = ChartEditorStore;
  const isFullscreen = isPure ? fromPureFullscreenStatus : fromEditorFullscreenStatus;
  const toggleFullscreen = isPure ? togglePureFullscreen : toggleFromEditorPureFullscreen;
  const [textMap, locale] = DashboardStore.getState((s) => [s.textMap, s.locale]);

  const {
    title: _title,
    i18n,
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
    loadData,
    customRender,
  } = view;

  const chartEditorVisible = !!editChartId;
  const childNode = React.Children.only(children);
  // 图表控件
  const dataConfigSelectors = get(api, 'extraData.dataConfigSelectors');
  const dynamicFilterKey = get(api, 'extraData.dynamicFilterKey');
  const dynamicFilterDataAPI = get(api, ['extraData.dynamicFilterDataAPI']);

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
    resData: {},
    fetchStatus: FetchStatus.NONE,
    staticLoadFnPayload: {},
    dynamicLoadFnPayloadMap: {},
    dynamicFilterData: [],
  });
  const viewRef = useRef<HTMLDivElement>(null);

  // 初始化 resData
  useEffect(() => {
    updater.resData(staticData as DC.StaticData);
  }, [api, staticData, updater]);

  const _loadData = useCallback((params: { fn: (payload: any, body?: any) => Promise<any>; arg?: any; body?: any }) => {
    const { arg, body, fn } = params;
    if (!isFunction(fn)) return;
    checkBeforeSave(view);
    updater.fetchStatus(FetchStatus.FETCH);
    // 调用外部传入的函数
    fn({
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
  }, [dataConvertor, dynamicLoadFnPayloadMap, staticLoadFnPayload, update, updater, view]);

  const _childNode = React.cloneElement(childNode, {
    ...childNode.props,
    data: resData,
    config,
    api,
    isEditView: chartEditorVisible,
    loadData: _loadData,
    onBoardEvent,
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

  // 传了 api 但是没有 loadData，帮助生成 loadData
  useEffect(() => {
    if (!!api && !isEmpty(api) && !loadData && isEmpty(staticData)) {
      _loadData({
        fn: createLoadDataFn({
          api: replaceVariable(api, globalVariable),
          chartType,
          ...(get(view, 'config.dataSourceConfig') || {}),
        }),
      });
    }
  }, [_loadData, api, chartType, globalVariable, loadData, staticData, view]);

  useEffect(() => {
    isFunction(loadData) && _loadData({ arg: chartQuery, fn: loadData });
    loadDynamicFilterData();
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
            <h2 className="dc-chart-title px12">{i18n ? i18n.title && i18n.title[locale] : title} </h2>
            <div className={classnames({ 'dc-chart-options': true, 'visibility-hidden': !isEditMode })}>
              <If condition={isEditMode && !chartEditorVisible && !isFullscreen}>
                <Tooltip title={textMap['config charts']}>
                  <Button type="text" onClick={() => editView(viewId)}><DcIcon type="edit" /></Button>
                </Tooltip>
              </If>
              <If condition={description}>
                <Tooltip title={i18n ? i18n.description && i18n.description[locale] : description}>
                  <Button type="text"><DcIcon type="info-circle" /></Button>
                </Tooltip>
              </If>
              <If condition={!isFullscreen && !chartEditorVisible}>
                <ViewDropdownOptions
                  view={view}
                  viewId={viewId}
                  viewRef={viewRef}
                  toggleFullscreen={toggleFullscreen}
                >
                  <Button type="text"><DcIcon type="more" /></Button>
                </ViewDropdownOptions>
              </If>
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
