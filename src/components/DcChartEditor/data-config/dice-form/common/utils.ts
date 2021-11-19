import { genUUID } from '../../../../../common/utils';
import { METRIC_UID_PREFIX } from '../constants';

/**
 *生成默认维度
 *
 * @param {Merge<Omit<DICE_DATA_CONFIGURATOR.Dimension, 'key'>, { prefix: string }>} { prefix, ...rest }
 * @returns {DICE_DATA_CONFIGURATOR.Dimension}
 */
export const genDefaultDimension = ({
  prefix,
  ...rest
}: Merge<Omit<DICE_DATA_CONFIGURATOR.Dimension, 'key'>, { prefix: string }>): DICE_DATA_CONFIGURATOR.Dimension => ({
  ...rest,
  key: `${prefix || METRIC_UID_PREFIX}${genUUID(8)}`,
});

export const getIntervalString = (interval: DICE_DATA_CONFIGURATOR.TimeInterval): string => {
  let intervalString = '';
  const { value, unit } = interval;
  switch (unit) {
    case 's':
    case 'm':
    case 'h':
      intervalString = String(value) + unit;
      break;
    case 'd':
      intervalString = `${String(value * 24)}h`;
      break;
    case 'W':
      intervalString = `${String(value * 24 * 7)}h`;
      break;
    default:
      break;
  }
  return intervalString;
};
