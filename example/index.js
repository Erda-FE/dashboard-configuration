import React from 'react';
import 'antd/lib/style/v2-compatible-reset';
import dva from 'dva';
import { Input } from 'antd';
import createHistory from 'history/createBrowserHistory';
import { registDataConvertor, registControl, registChartOption, registTheme } from '../src/config';
import { ajaxConvertor } from './mock/ajax-data';
import AppRouter from './router';

const history = createHistory();

const app = dva({
  history,
});

registDataConvertor('line', (data) => {
  console.log('line convertor:', data);
  return data;
});
registDataConvertor('ajax', ajaxConvertor);

registControl('input', ({ onChange, loadData }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    onChange({ ctr1: value });
    if (value === 'load') {
      loadData();
    }
  };
  return <Input placeholder="试试改内容为：load" onChange={handleChange} style={{ width: '200px' }} />;
});
registControl('input2', ({ query, onChange }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    onChange({ ctr2: value });
  };
  return <Input value={`所有控件数据：${Object.values(query).join(',')}`} onChange={handleChange} style={{ width: '300px' }} />;
});

const fullTheme = registTheme('test', {
  color: 'red',
});
console.log('fullTheme:', fullTheme);


registChartOption('line', {
  grid: {
    left: 80,
    right: 80,
  },
});

app.router(() => <AppRouter {...{ app, history }} />);
app.start('#content');
