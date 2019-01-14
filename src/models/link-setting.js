import { cloneDeep } from 'lodash';

const defaultState = {
  linkId: '',
  linkMap: {},
};

export default {
  namespace: 'linkSetting',
  state: cloneDeep(defaultState), // 使用cloneDeep，因为layout在整个运作过程中涉及到引用，而immutable太重
  effects: {

  },
  reducers: {
    openLinkSetting(state, { linkId }) {
      return { ...state, linkId };
    },
    closeLinkSetting(state) {
      return { ...state, linkId: '' };
    },
  },
};
