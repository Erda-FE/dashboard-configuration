declare namespace DC_GLOBAL_FILTERS {
  type FilterType = 'time' | '';

  interface Filter {
    name: string;
    label: string;
    type: FilterType;
    // enable 优先级高于 visible
    enable: boolean;
    visible: boolean;
  }
}
