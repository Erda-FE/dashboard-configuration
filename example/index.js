import React from 'react';
import ReactDOM from 'react-dom';
import { Input } from 'antd';
import { registDataConvertor, registControl, registChartOption, registTheme } from '../src';
import { ajaxConvertor } from './mock/ajax-data';
import { darkTheme } from './theme';
import App from './app';

const prepare = () => {
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

  const fullTheme = registTheme('dark', darkTheme);
  console.log('fullTheme:', fullTheme);


  registChartOption('line', {
    grid: {
      left: 80,
      right: 80,
    },
  });
  return Promise.resolve();
};

prepare().then(() => {
  ReactDOM.render(<App />, document.getElementById('root'));
});
