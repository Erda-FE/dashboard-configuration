/*
 * @Author: licao
 * @Date: 2020-12-29 16:37:41
 * @Last Modified by: licao
 * @Last Modified time: 2020-12-29 17:16:47
 */

const client = (url: string, { body, ...restConfig }: Record<string, any>) => {
  const defaultContentType = { 'content-type': 'application/json' };
  const defaultMethod = body ? 'POST' : 'GET';
  const config: Record<string, any> = {
    method: defaultMethod,
    ...restConfig,
    headers: {
      ...((restConfig?.method || defaultMethod) === 'POST' ? defaultContentType : {}),
      ...restConfig.headers,
    },
  };
  body && (config.body = JSON.stringify(body));
  return window
    .fetch(url, config)
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
