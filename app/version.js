/**
 * 应用版本检查
 * 局限：
 * 1、非增量更新
 * 2、浏览器需要刷新页面
 */
import agent from 'agent';
import { message } from 'antd';

function getCurrentVersion() {
  return agent.get('/version.json')
    .then(response => response.body);
}

window.addEventListener('unhandledrejection', (e) => { // 兜底方案，当用户路由变更时机恰巧在5min时
  const msg = e.reason.message;
  if (msg && msg.indexOf('Loading chunk') > -1) {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      message.error('亲，检查一下网络连接', 3);
    }
  }
  return true;
});

export function checkVersion() {
  let currentVersion = null;
  let timeId = null;
  getCurrentVersion().then((response) => { // 初次获取版本号
    response = response || {};
    currentVersion = response.version;
  });
  timeId = setInterval(() => {
    getCurrentVersion().then((response) => {
      response = response || {};
      if (currentVersion === response.version) return;
      window.needReload = true; // 将会正在path-listener监听到路由变化时，被触发
      clearInterval(timeId);
      timeId = null;
    });
  }, 300000); // 5min请求一下版本号
}
