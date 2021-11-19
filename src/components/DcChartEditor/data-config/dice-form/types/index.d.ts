declare namespace DICE_DATA_CONFIGURATOR {
  /** 指标类型：时间、指定指标、自定义表达式 */
  type DimensionMetricType = 'time' | 'field' | 'expr' | 'filter' | 'sort';
  /** 维度配置注册的事件名 */
  type DimensionConfigsActionType =
    | 'configExpr'
    | 'configAlias'
    | 'configTime'
    | 'configFieldAggregation'
    | 'configFilter'
    | 'configSort'
    | 'updateOrder';
  /** 指标类型 */
  type FieldType = 'bool' | 'number' | 'string';
  /** 维度类型：数值维度，类别维度=文本维度+时间维度，筛选维度 */
  type DimensionType = 'value' | 'type' | 'filter';
  /** 值维度单位配置 */
  type DimensionUnitType = 'CUSTOM' | 'NUMBER' | 'PERCENT' | 'CAPACITY' | 'TRAFFIC' | 'TIME';

  interface TimeInterval {
    value: number;
    unit: 's' | 'm' | 'h' | 'd' | 'W';
  }

  interface TimeField {
    value: string;
    unit: 'ns' | 'µs' | 'ms' | 's' | 'm' | 'h' | 'day';
  }

  interface FieldUnit {
    type: DimensionUnitType;
    unit: string;
  }

  interface I18n {
    zh: string;
    en: string;
  }

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
     *国际化
     *
     * @type {object}
     * @memberof ValueDimension
     */
    i18n?: {
      alias?: I18n;
      title?: I18n;
      description?: I18n;
    };
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
    resultType?: 'number' | 'string';
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
    /**
     *字段单位配置
     *
     * @type {FieldUnit}
     * @memberof ValueDimension
     */
    unit?: FieldUnit;
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
     *     unit: 's' | 'm' | 'h' | 'D' | 'W'
     *   })}
     * @memberof Dimension
     */
    timeInterval?: TimeInterval;
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
    timeField?: TimeField;
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
    sort?: 'DESC' | 'ASC';
    /**
     *表格列宽
     *
     * @type {number}
     * @memberof Dimension
     */
    width?: number;
    copy?: boolean;
  }

  interface AggregationInfo {
    aggregation: string;
    name: string;
    result_type: 'string' | 'number';
  }
}
