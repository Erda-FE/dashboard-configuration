/* 下钻地图
 * @Author: licao
 * @Date: 2020-10-26 17:38:44
 * @Last Modified by: licao
 * @Last Modified time: 2020-11-17 17:40:41
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { useMount } from 'react-use';
import { map, slice, findIndex } from 'lodash';
import { Breadcrumb } from 'antd';
import echarts from 'echarts';
import { Choose, When, Otherwise } from 'tsx-control-statements/components';
import agent from '../../../utils/agent';
import { useUpdate } from '../../../common/use-hooks';
import ChartSizeMe from '../chart-sizeme';
import { adcodeMap } from '../../../constants/adcode-map';
import { getOption } from './option';
import ChartEditorStore from '../../../stores/chart-editor';

import './index.scss';

interface IProps {
  data: any;
  isEditView: boolean;
  config: {
    option: object;
    onChange?: (curMapTypes: string[]) => void;
  };
  loadData: (arg?: any) => void;
}

const noop = () => {};

const ChartMap = React.forwardRef((props: IProps, ref: React.Ref<any>) => {
  const loadData = useMemo(() => props.loadData || noop, [props.loadData]);
  const { onEditorChange } = ChartEditorStore;

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
    props.isEditView && onEditorChange({ curMapType: mapType });
    loadData(mapType);
  }, [mapType, props.isEditView, onEditorChange, loadData]);

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
