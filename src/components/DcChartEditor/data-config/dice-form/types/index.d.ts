declare namespace DICE_DATA_CONFIGURATOR {
  /**
   *指标类型：时间、指定指标、自定义表达式
   *
   * @type DimensionMetricType
   */
  type DimensionMetricType = 'time' | 'field' | 'expr';

  /**
   *维度类型：数值维度，类别维度=文本维度+时间维度
   *
   * @type DimensionType
   */
  type DimensionType = 'value' | 'type';

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
     *聚合方法
     *
     * @type {string}
     * @memberof ValueDimension
     */
    aggregation?: string;
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
       unit: 's' | 'm' | 'h' | 'D' | 'W' | 'M' | 'Y'
     };
     /**
      *时间格式，可选，type 为 time 时可指定
      *
      * @type {string}
      * @memberof Dimension
      */
     timeFormat?: string;
  }
}