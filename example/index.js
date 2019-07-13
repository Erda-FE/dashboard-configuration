import React from 'react';
import 'antd/lib/style/v2-compatible-reset';
import dva from 'dva';
import { Input } from 'antd';
import createHistory from 'history/createBrowserHistory';
import models from '~/models';
import { registDataConvertor, registControl } from '~/config';
import AppRouter from './router';

const history = createHistory();

const app = dva({
  history,
});

registDataConvertor('line', (data) => {
  console.log('line convertor:', data);
  return data;
});

registControl('input', ({ onChange, loadData }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    onChange({ ctr1: value });
    if (value === 'load') {
      loadData();
    }
  };
  return <Input defaultValue="试试改内容为：load" onChange={handleChange} style={{ width: '200px' }} />;
});
registControl('input2', ({ query, onChange }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    onChange({ ctr2: value });
  };
  return <Input value={`所有控件数据：${Object.values(query).join(',')}`} onChange={handleChange} style={{ width: '300px' }} />;
});

models.forEach((model) => {
  app.model(model);
});
app.router(() => <AppRouter {...{ app, history }} />);
app.start('#content');
