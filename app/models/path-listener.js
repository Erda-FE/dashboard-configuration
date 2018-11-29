import qs from 'qs';

let currentPathname = null; // 用于记录 pathname 变更
export default {
  namespace: 'path-listener',
  state: {},
  subscriptions: {
    setup({ history }) {
      history.listen((location) => {
        if (window.needReload && currentPathname && currentPathname !== location.pathname) { // 当应用版本、pathname发生变化，那么跳转时就进行刷新
          window.location.reload();
        } else {
          currentPathname = location.pathname;
        }
        if (location.search[0] === '?') {
          location.search = location.search.substring(1);
        }
        location.query = qs.parse(location.search); // 增加 query 参数
      });
    },
  },
};
