import * as React from 'react';
import { map } from 'lodash';
import { Popover } from '@terminus/nusi';
import classnames from 'classnames';
import { DcIcon } from '../../../common';
import basicCharts from '../../DcCharts';

import './index.scss';

interface IProps {
  value: DC.ViewType;
  typeDimensions: DICE_DATA_CONFIGURATOR.Dimension[];
  valueDimensions: DICE_DATA_CONFIGURATOR.Dimension[];
  onChange: (v: DC.ViewType) => void;
}

const SwitchChartType = ({
  value,
  typeDimensions,
  valueDimensions,
  onChange,
}: IProps) => {
  return (
    <div className="dc-editor-switch-chart">
      {map(basicCharts, ({ name, enName, icon }: DC.ViewDefItem, chartType) => (
        <Popover content={name} footer={false}>
          <div
            className={classnames({
              'dc-editor-switch-chart-item': true,
              'center-flex-box': true,
              active: value === chartType,
            })}
            onClick={() => { onChange(chartType as DC.ViewType); }}
          >
            <DcIcon type={icon} useSymbol />
          </div>
        </Popover>
      ))
      }
    </div >
  );
};

export default SwitchChartType;
