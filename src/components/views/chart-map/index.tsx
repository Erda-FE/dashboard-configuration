import React, { useCallback, useEffect } from 'react';
import { useMount } from 'react-use';
import { useUpdate } from '../../../common/use-hooks';
import ChartSizeMe from '../chart-sizeme';
import { provinceNameMap } from '../../../constants/province-name';
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
    mapType: 'china',
    requiredMapType: [],
  });

  // 加载地图数据
  useMount(() => require('echarts/map/js/china'));

  useEffect(() => {
    if (provinceNameMap.has(mapType) && !requiredMapType.includes(mapType)) {
      require(`echarts/map/js/province/${provinceNameMap.get(mapType)}`);
      updater.requiredMapType([...requiredMapType, mapType]);
    }
  }, [mapType, requiredMapType, updater]);

  const _getOption = useCallback(
    (data: DC.StaticData, config: DC.ChartConfig) => getOption(data, config, mapType),
    [mapType]
  );

  const changeMapType = (_mapType: string) => {
    updater.mapType(provinceNameMap.has(_mapType) ? _mapType : 'china');
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
