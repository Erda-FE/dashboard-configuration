/* 地图
 * @Author: licao
 * @Date: 2020-10-26 17:38:44
 * @Last Modified by: licao
 * @Last Modified time: 2020-10-26 17:40:53
 */
import React, { useCallback } from 'react';
import { useMount } from 'react-use';
import echarts from 'echarts';
import agent from '../../../utils/agent';
import { useUpdate } from '../../../common/use-hooks';
import ChartSizeMe from '../chart-sizeme';
import { adcodeMap } from '../../../constants/adcode-map';
import { getOption } from './option';

interface IProps {
  data: any
  viewId: string
  config: {
    option: object
  }
}

const ChartMap = React.forwardRef((props: IProps, ref: React.Ref<any>) => {
  const [{ mapType, requiredMapType }, updater] = useUpdate({
    mapType: '',
    requiredMapType: [],
  });

  useMount(() => {
    // 初始化全国地图
    agent.get('https://geo.datav.aliyun.com/areas_v2/bound/100000_full.json')
      .then((_data: any) => registerMap('china', JSON.parse(_data.text)));
  });

  const registerMap = (_mapType: string, _data: any) => {
    echarts.registerMap(_mapType, _data);
    updater.mapType(_mapType);
    updater.requiredMapType([...requiredMapType, mapType]);
  };

  const _getOption = useCallback(
    (_data: DC.StaticData, config: DC.ChartConfig) => getOption(_data, config, mapType),
    [mapType]
  );

  const changeMapType = (_mapType: string) => {
    if (!adcodeMap.has(_mapType)) return;
    const adcode = adcodeMap.get(_mapType);
    agent.get(`https://geo.datav.aliyun.com/areas_v2/bound/${adcode}_full.json`)
      .then((_data: any) => registerMap(_mapType, JSON.parse(_data.text)));
  };

  return (
    <ChartSizeMe
      option={_getOption(props.data, props.config)}
      onEvents={{ click: (params: any) => changeMapType(params.name) }}
      ref={ref}
      {...props}
    />
  );
});

export default ChartMap;
