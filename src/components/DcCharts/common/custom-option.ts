import { cloneDeep, isString, merge } from 'lodash';
import { getConfig } from 'src/config';

/**
 * 获取在配置中自定义的图表配置，并支持返回的数据中携带图表配置
 *
 * @param {DC.StaticData} data
 * @param {DC.ChartConfig} config
 * @returns {object}
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const getCustomOption = (data: DC.StaticData = {} as DC.StaticData, config: DC.ChartConfig = {}): object => {
  // 优先级：customOptionFn > option
  let customOption;
  let { optionFn: customOptionFn } = config;
  const { option } = config;

  if (customOptionFn) {
    if (isString(customOptionFn)) {
      // 取之前注册好的 customOptionFn
      customOptionFn = getConfig(['chartOptionFn', customOptionFn]) as DC.OptionFn;
      // 未注册
      if (!customOptionFn) {
        customOptionFn = (d: any) => d;
        // eslint-disable-next-line no-console
        console.warn(`optionFn \`${customOptionFn}\` not registered yet`);
      }
    }
    customOption = customOptionFn(data, config.optionExtra);
  } else if (option) {
    customOption = option;
    if (isString(customOption)) {
      customOption = getConfig(['chartOption', customOption]);
      if (!customOption) {
        customOption = {};
        // eslint-disable-next-line no-console
        console.warn(`customOption \`${customOption}\` not registered yet`);
      }
    }
    customOption = cloneDeep(customOption) as any;
  }

  if (data.extraOption) {
    customOption = merge(customOption, data.extraOption);
  }

  return customOption || {};
};
