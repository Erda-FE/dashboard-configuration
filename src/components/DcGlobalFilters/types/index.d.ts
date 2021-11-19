declare namespace DC_GLOBAL_FILTERS {
  type FilterType = 'time' | 'search' | 'select' | 'constant';

  interface Filter {
    key: string;
    type: FilterType;
    name: string;
    label?: string;
    desc?: string;
    placeholder?: string;
    defaultValue?: any;
    // type: FilterType;
    enable: boolean;
  }
}
