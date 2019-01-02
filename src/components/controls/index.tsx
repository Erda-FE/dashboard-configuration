import React from 'react';
import { Icon } from 'antd';
import { IChartsMap } from '../../types';

const defaultControlsMap: IChartsMap = {
  select: {
    name: '下拉框',
    icon: <Icon type="question" />,
  }
};

export default defaultControlsMap;