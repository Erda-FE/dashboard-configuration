import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import FilterComp from './filter-component';
import GlobalFiltersStore from '../../stores/global-filters';

const DcGlobalFilters = () => {
  const [filters, globalVariable] = GlobalFiltersStore.useStore((s) => [s.globalFilters, s.globalVariable]);
  const { updateGlobalVariable } = GlobalFiltersStore;
  const displayFilters = useMemo(() => filters.filter(({ enable }) => enable), [filters]);

  const handleChange = (name: string, val: any) => {
    updateGlobalVariable({ [name]: val });
  };

  if (isEmpty(displayFilters)) return null;

  return (
    <div className="dc-global-filters wrap-flex-box mb8">
      {displayFilters.map(({ key, name, ...rest }) => (
        <FilterComp key={key} className="mr12" onChange={(val: any) => handleChange(name, val)} {...rest} />
      ))}
    </div>
  );
};

export default DcGlobalFilters;
