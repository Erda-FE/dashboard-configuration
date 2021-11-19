import * as React from 'react';
import TimeSelector from './TimeSelector';
import { Input } from 'antd';
import './index.scss';

const { Search } = Input;

type IProps = Merge<
  {
    className: string;
    onChange: (val: any) => void;
  },
  Partial<DC_GLOBAL_FILTERS.Filter>
>;

const FilterComp = ({ className, type, label, placeholder, defaultValue, onChange }: IProps) => {
  return (
    <div className={`dc-global-filter-item flex-box mb4${className ? ` ${className}` : ''}`}>
      <If condition={!!label}>
        <div className="dc-global-filter-item-label center-flex-box dark-border border-radius px8 mr4">{label}</div>
      </If>
      <Choose>
        <When condition={type === 'time'}>
          <TimeSelector defaultTime={defaultValue} onOk={(v) => onChange([v.startTimeMs, v.endTimeMs])} />
        </When>
        <When condition={type === 'search'}>
          <Search allowClear placeholder={placeholder} />
        </When>
      </Choose>
    </div>
  );
};

export default FilterComp;
