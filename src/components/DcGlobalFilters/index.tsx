import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import FilterComp from './filter-component';
import GlobalFiltersStore from 'src/stores/global-filters';

const DcGlobalFilters = () => {
  const [filters] = GlobalFiltersStore.useStore((s) => [s.globalFilters]);
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
