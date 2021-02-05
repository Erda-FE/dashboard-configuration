import { map } from 'lodash';
import { DC } from 'src/types';

/**
* 分离 layout 结构为布局结构和视图内容结构
*
* @param {DC.ILayout} layout
* @returns {[DC.PureLayoutItem[], Record<string, DC.View>]}
*/
export const splitLayoutAndView = (layout: DC.Layout): [DC.PureLayoutItem[], Record<string, DC.View>] => {
  const viewMap = {};
  const pureLayout = map(layout, (item) => {
    const { view, ...rest } = item;
    viewMap[item.i] = view;
    return rest;
  });
  return [pureLayout, viewMap];
};
