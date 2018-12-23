import React from 'react';
import Cookie from 'js-cookie';
import { get } from 'lodash';
import 'antd/lib/style/v2-compatible-reset';
import { notification } from 'antd';
import dva from 'dva';
import createLoading from 'dva-loading';
import moment from 'moment';
import 'moment/locale/zh-cn';
import createHistory from 'history/createBrowserHistory';
import AppRouter from './router';
import models from './models';

moment.locale('zh-cn');
const loginUrl = '/api/login/terminus';
const { location } = window;
const history = createHistory();
if (process.env.NODE_ENV === 'dev') {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
}

const app = dva({
  history,
  onError: (e) => {
    const statusCode = get(e, ['response', 'statusCode']);
    if (statusCode === 401 || e.rawResponse === 'user.not.login') {
      Cookie.set('lastUrl', location.pathname);
      notification.warning({
        message: '未登录',
        description: '可能是用户信息已过期，正在转向重新登录',
      });
      setTimeout(() => {
        location.href = loginUrl;
      }, 1500);
      return;
    }
    console.error(e);
    notification.error({
      message: '发生错误',
      description: JSON.stringify(e.rawResponse || '请检查网络连接'),
    });
  },
});

models.forEach((model) => {
  app.model(model);
});
app.use(createLoading({ namespace: 'isFetching', effects: true }));
app.router(() => <AppRouter {...{ app, history }} />);
app.start('#content');
