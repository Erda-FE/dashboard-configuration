declare namespace MONITOR_COMMON_METADATA {
  interface Filter {
    operation: string;
    name: string;
  }
  interface MetaConstantMap {
    types: {
      [type: string]: {
        aggregations: Array<{
          aggregation: string;
          name: string;
          result_type: string;
        }>;
        filters?: Filter[];
        operations: Array<{
          operation: string;
          name: string;
        }>;
      };
    };
    filters: Array<{
      operation: string;
      name: string;
    }>;
  }

  type MetaMetrics = Array<{
    metric: string;
    name: string;
    filters: Array<{
      tag: string;
      op: string;
      value: string;
    }>;
    fields: Array<{
      key: string;
      name: string;
      type: string;
      unit: string;
    }>;
    tags: Array<{
      key: string;
      name: string;
      values?: Array<{
        value: string;
        name: string;
      }>;
    }>;
  }>;

  interface MetaData {
    meta: MetaConstantMap;
    id: string;
    metrics: MetaMetrics;
  }
}
