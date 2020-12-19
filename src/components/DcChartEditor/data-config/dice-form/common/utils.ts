import { genUUID } from '../../../../../common/utils';
import { METRIC_UID_PREFIX } from '../constants';

/**
 *生成默认维度
 *
 * @param {Merge<Omit<DICE_DATA_CONFIGURATOR.Dimension, 'key'>, { prefix: string }>} { prefix, ...rest }
 * @returns {DICE_DATA_CONFIGURATOR.Dimension}
 */
export const genDefaultDimension = ({ prefix, ...rest }: Merge<Omit<DICE_DATA_CONFIGURATOR.Dimension, 'key'>, { prefix: string }>): DICE_DATA_CONFIGURATOR.Dimension => (
  {
    ...rest,
    key: `${prefix || METRIC_UID_PREFIX}${genUUID(8)}`,
  }
);