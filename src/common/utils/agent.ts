import qs from 'querystringify';
import { pickBy, isNil } from 'lodash';
/**
 * 获取cookies对象，传入key时获取单个字段
 * @param 需要获取的cookie key
 */
function getCookies(key: string) {
  const cookies = {};
  window.document.cookie.split(';').forEach((item) => {
    const [k, v] = item.split('=');
    cookies[k.trim()] = v && v.trim();
  });
  return key ? cookies[key] : cookies;
}


function getHeaders(method: string) {
  const headers = {
    Accept: 'application/vnd.dice+json;version=1.0',
    Lang: localStorage.getItem('dashboardLang') === 'zh' ? 'zh-CN' : 'en-US',
  };
  if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
    const token = getCookies('OPENAPI-CSRF-TOKEN');
    if (token) {
      headers['OPENAPI-CSRF-TOKEN'] = token;
    }
  }
  if (method === 'POST') {
    headers['content-type'] = 'application/json';
  }
  return headers;
}

/* 简单封装 Fetch
 * @Author: licao
 * @Date: 2020-12-29 16:37:41
 */
const client = (url: string, { method, body, query, ...restConfig }: Record<string, any>) => {
  const defaultMethod = body ? 'POST' : 'GET';
  const _method = (method || defaultMethod).toUpperCase();
  const resultRequest = pickBy(query, (item) => !isNil(item));
  const queryStr = qs.stringify(resultRequest);
  const config: Record<string, any> = {
    method: _method,
    ...restConfig,
    headers: {
      ...getHeaders(_method),
      ...restConfig.headers,
    },
  };
  body && (config.body = JSON.stringify(body));
  return window
    .fetch(queryStr ? `${url}?${queryStr}` : url, config)
    .then(async (res: any) => {
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
};

export default client;
