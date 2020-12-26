/* 下钻地图
 * @Author: licao
 * @Date: 2020-10-26 17:38:44
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-26 16:48:15
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { useMount } from 'react-use';
import { map, slice, findIndex, cloneDeep } from 'lodash';
import { Breadcrumb } from 'antd';
import echarts from 'echarts';
import { Choose, When, Otherwise } from 'tsx-control-statements/components';
import agent from '../../../common/utils/agent';
import { useUpdate } from '../../../common/use-hooks';
import { ChartSizeMe } from '../common';
import { adcodeMap } from '../../../constants/adcode-map';
import { getOption } from './option';
import ChartEditorStore from '../../../stores/chart-editor';
import { MAP_LEVEL, MAP_ALIAS } from '../../DcChartEditor/data-config/dice-form/constants';

import './index.scss';

interface IProps {
  data: any;
  isEditView: boolean;
  config: {
    option: object;
    onChange?: (curMapTypes: string[]) => void;
  };
  body: any;
  loadData: (arg?: any, body?: any) => void;
}

const noop = () => {};

const ChartMap = React.forwardRef((props: IProps, ref: React.Ref<any>) => {
  const loadData = useMemo(() => props.loadData || noop, [props.loadData]);
  const preBody = useMemo(() => props.body, [props.body]);
  const { updateEditor } = ChartEditorStore;

  const [{ mapType, registeredMapType }, updater] = useUpdate({
    mapType: [],
    registeredMapType: [],
  });

  useMount(() => {
    // 初始化全国地图
    agent.get('https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json')
      .then((_data: any) => registerMap('中华人民共和国', JSON.parse(_data.text)));
  });

  useEffect(() => {
    // 编辑状态下存储当前地图层级到 store
    props.isEditView && updateEditor({ curMapType: mapType });
    // 临时加的，需重构
    const [mapLevel, preLevel] = [MAP_LEVEL[mapType.length - 1], MAP_LEVEL[mapType.length - 2]];
    const _select = cloneDeep(preBody?.select);
    if (!_select) return;
    const idx = findIndex(_select, { alias: MAP_ALIAS });
    _select[idx] = { expr: `${mapLevel}::tag`, alias: MAP_ALIAS };
    const body = {
      groupby: [mapLevel],
      select: _select,
      where: preLevel ? [`${preLevel}='${mapType[mapType.length - 1]}'`] : undefined,
    };
    loadData(undefined, body);
  }, [mapType, props.isEditView, loadData, preBody]);

  const registerMap = (_mapType: string, _data: any) => {
    echarts.registerMap(_mapType, _data);
    updater.mapType([...mapType, _mapType]);
    updater.registeredMapType([...registeredMapType, _mapType]);
  };

  const _getOption = useCallback(
    (_data: DC.StaticData, config: DC.ChartConfig) => getOption(_data, config, mapType[mapType.length - 1]),
    [mapType]
  );

  const changeMapType = (_mapType: string) => {
    // 点击最下级无效
    if (!adcodeMap.has(_mapType)) return;

    if (registeredMapType.includes(_mapType)) {
      if (mapType.includes(_mapType)) {
        updater.mapType(slice(mapType, 0, findIndex(mapType, (_type) => _type === _mapType) + 1));
      } else {
        updater.mapType([...mapType, _mapType]);
      }
      return;
    }

    const adcode = adcodeMap.get(_mapType);
    agent.get(`https://geo.datav.aliyun.com/areas_v2/bound/${adcode}_full.json`)
      .then((_data: any) => registerMap(_mapType, JSON.parse(_data.text)));
  };

  return (
    <div className="dc-chart-content">
      <ChartSizeMe
        option={_getOption(props.data, props.config)}
        onEvents={{ click: (params: any) => changeMapType(params.name) }}
        ref={ref}
        {...props}
      />
      <Breadcrumb>
        {map(mapType, (_type, _k) => (
          <Breadcrumb.Item key={_type}>
            <Choose>
              <When condition={_k < mapType.length - 1}>
                <span className="dc-hover-active" onClick={() => changeMapType(_type)}>{_type}</span>
              </When>
              <Otherwise>
                {_type}
              </Otherwise>
            </Choose>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
});

export default ChartMap;
