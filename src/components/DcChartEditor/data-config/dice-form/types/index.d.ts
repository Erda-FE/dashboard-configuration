declare namespace DICE_DATA_CONFIGURATOR {
  /**
   *指标类型：时间、指定指标、自定义表达式
   *
   * @type DimensionMetricType
   */
  type DimensionMetricType = 'time' | 'field' | 'expr' | 'filter';

  type DimensionConfigsActionType = 'configExpr' | 'configAlias' | 'configTime' | 'configFieldAggregation' | 'configFilter';

  type FieldType = 'bool' | 'number' | 'string';

  /**
   *维度类型：数值维度，类别维度=文本维度+时间维度，筛选维度
   *
   * @type DimensionType
   */
  type DimensionType = 'value' | 'type' | 'filter';

  interface ValueDimension {
    /**
     *列表唯一 key
     *
     * @type {string}
     * @memberof ValueDimension
     */
    key: string;
    /**
     *指标类型：指定指标、自定义表达式
     *
     * @type {('field' | 'expr')}
     * @memberof ValueDimension
     */
    type: 'field' | 'expr';
    /**
     *别名
     *
     * @type {string}
     * @memberof ValueDimension
     */
    alias: string;
    /**
     *指标，type 为 field 时必须
     *
     * @type {string}
     * @memberof ValueDimension
     */
    field?: string;
    /**
     *指标结果类型，type 为 field 时必须
     *
     * @type {('number' | 'string')}
     * @memberof ValueDimension
     */
    fieldType?: 'number' | 'string';
    /**
     *聚合方法
     *
     * @type {string}
     * @memberof ValueDimension
     */
    aggregation?: string;
    /**
     *自定义表达式
     *
     * @type {string}
     * @memberof ValueDimension
     */
    expr?: string;
  }

  /**
   *
   *
   * @interface Dimension
   * @extends {Omit<ValueDimension, 'type'>}
   */
  interface Dimension extends Omit<ValueDimension, 'type'> {
    /**
     * @type {DimensionMetricType}
     * @memberof Dimension
     */
    type: DimensionMetricType;
    /**
     *时间间隔 1s、1D，可选，type 为 time 时可指定
     *
     * @type {({
      *     value: number;
      *     unit: 's' | 'm' | 'h' | 'D' | 'W' | 'M' | 'Y'
      *   })}
      * @memberof Dimension
      */
    timeInterval?: {
      value: number;
      unit: 's' | 'm' | 'h' | 'd' | 'W' | 'M';
    };
    /**
      *时间格式，可选，type 为 time 时可指定
      *
      * @type {string}
      * @memberof Dimension
      */
    timeFormat?: string;
    /**
     *自定义时间字段，可选，type 为 time 时可指定
     *
     * @type {string}
     * @memberof Dimension
     */
    timeField?: string;
    /**
     *自定义时间区间，可选，type 为 time 时可指定
     *
     * @type {string}
     * @memberof Dimension
     */
    customTime?: string;
    /**
     *过滤
     *
     * @type {{
     *       operator: string;
     *       value: any;
     *     }}
     * @memberof Dimension
     */
    filter?: {
      operation: string;
      value: any;
    };
  }

  interface AggregationInfo {
    aggregation: string;
    name: string;
    result_type: 'string' | 'number';
  }
}
