/* 下钻地图
 * @Author: licao
 * @Date: 2020-10-26 17:38:44
 * @Last Modified by: licao
 * @Last Modified time: 2021-01-16 19:48:32
 */
import React, { useCallback, useMemo } from 'react';
import { useMount } from 'react-use';
import { cloneDeep, findIndex, map, slice } from 'lodash';
import { Breadcrumb, message } from 'antd';
import { registerMap as registerEchartsMap } from 'echarts';
import agent from 'src/common/utils/agent';
import { useUpdate } from 'src/common/use-hooks';
import { ChartSizeMe } from 'src/components/DcCharts/common';
import { adcodeMap } from 'src/constants/adcode-map';
import { getOption } from './option';
import ChartEditorStore from 'src/stores/chart-editor';
import { MAP_ALIAS, MAP_LEVEL } from 'src/components/DcChartEditor/data-config/dice-form/constants';
import './index.scss';

interface IProps {
  data: any;
  isEditView: boolean;
  config: {
    option: object;
    onChange?: (curMapTypes: string[]) => void;
  };
  api: DC.API;
  loadData: (arg?: any, body?: any) => void;
}

const noop = () => {};

const ChartMap = React.forwardRef((props: IProps, ref: React.Ref<any>) => {
  const loadData = useMemo(() => props.loadData || noop, [props.loadData]);
  const preBody = props.api?.body;
  const { updateEditor } = ChartEditorStore;

  const [{ mapTypes, registeredMapType }, updater] = useUpdate({
    mapTypes: [],
    registeredMapType: [],
  });

  useMount(() => {
    // 初始化全国地图
    agent('https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json', { referrer: '' })
      .then((res) => registerMap('中华人民共和国', res))
      .catch((err) => {
        message.error(err);
      });
  });

  const loadMapDataSource = (_mapTypes: string[]) => {
    // 临时加的，需重构
    const [mapLevel, preLevel] = [MAP_LEVEL[_mapTypes.length - 1], MAP_LEVEL[_mapTypes.length - 2]];
    const _select = cloneDeep(preBody?.select);
    if (!_select) return;
    const idx = findIndex(_select, { alias: MAP_ALIAS });
    _select[idx] = { expr: `${mapLevel}::tag`, alias: MAP_ALIAS };
    const body = {
      groupby: [mapLevel],
      select: _select,
      where: preLevel
        ? [...(preBody?.where || []), `${preLevel}='${_mapTypes[_mapTypes.length - 1]}'`]
        : preBody?.where,
    };
    loadData(undefined, body);
  };

  const updateMaps = (_mapTypes: string[]) => {
    updater.mapTypes(_mapTypes);
    props.isEditView && updateEditor({ curMapType: _mapTypes });
    loadMapDataSource(_mapTypes);
  };

  const registerMap = (mapType: string, _data: any) => {
    registerEchartsMap(mapType, _data);
    updater.registeredMapType([...registeredMapType, mapType]);
    updateMaps([...mapTypes, mapType]);
  };

  const _getOption = useCallback(
    (_data: DC.StaticData, config: DC.ChartConfig) => getOption(_data, config, mapTypes[mapTypes.length - 1]),
    [mapTypes],
  );

  const changeMapType = (mapType: string) => {
    // 点击最下级无效
    if (!adcodeMap.has(mapType)) return;
    let _mapTypes;

    if (registeredMapType.includes(mapType)) {
      if (mapTypes.includes(mapType)) {
        _mapTypes = slice(mapTypes, 0, findIndex(mapTypes, (_type) => _type === mapType) + 1);
      } else {
        _mapTypes = [...mapTypes, mapType];
      }
      updateMaps(_mapTypes);
      return;
    }

    const adcode = adcodeMap.get(mapType);
    agent(`https://geo.datav.aliyun.com/areas_v2/bound/${adcode}_full.json`, { referrer: '' })
      .then((res) => registerMap(mapType, res))
      .catch((err) => {
        message.error(err);
      });
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
        {map(mapTypes, (_type, _k) => (
          <Breadcrumb.Item key={_type}>
            <Choose>
              <When condition={_k < mapTypes.length - 1}>
                <span className="dc-hover-active" onClick={() => changeMapType(_type)}>
                  {_type}
                </span>
              </When>
              <Otherwise>{_type}</Otherwise>
            </Choose>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
});

export default ChartMap;
