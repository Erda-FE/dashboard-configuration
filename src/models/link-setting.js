import { cloneDeep, forEach } from 'lodash';

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
    deleteLinkMap(state, { linkId }) {
      const { linkMap } = state;
      delete linkMap[linkId];
      forEach(linkMap, ((linkInfo) => {
        delete linkInfo[linkId];
      }));
      return { ...state, linkMap: { ...linkMap } };
    },
    updateLinkMap(state, { linkId, values }) {
      return { ...state, linkMap: { ...state.linkMap, [linkId]: values } };
    },
    openLinkSetting(state, { linkId }) {
      return { ...state, linkId };
    },
    closeLinkSetting(state) {
      return { ...state, linkId: '' };
    },
  },
};
