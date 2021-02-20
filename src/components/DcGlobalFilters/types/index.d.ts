declare namespace DC_GLOBAL_FILTERS {

  type FilterType = 'time' | 'input' | 'select' | 'constant';

  interface Filter {
    key: string;
    type: FilterType;
    name: string;
    label?: string;
    desc?: string;
    // type: FilterType;
    // enable 优先级高于 visible
    enable: boolean;
    visible?: boolean;
  }
}
