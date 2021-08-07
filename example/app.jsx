/* eslint-disable no-console */
import React from 'react';
import { BoardGrid, PureBoardGrid, setLocale, getLocale, getTheme, setTheme } from '../src';
import layout from './mock/data';
// import layout2 from './mock/data2';
import { useMount } from 'react-use';
import { Button } from 'antd';
import './app.css'

function App() {
  console.log('current locale:', getLocale());
  console.log('current theme:', getTheme());
  useMount(() => {
    // console.log('change locale to en');
    // setLocale('en');
  });

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        语言：
        <Button style={{ marginRight: 12 }} onClick={() => setLocale('zh')}>中文</Button>
        <Button style={{ marginRight: 12 }} onClick={() => setLocale('en')}>English</Button>
        主题：
        <Button style={{ marginRight: 12 }} onClick={() => setTheme('dice')}>Dice</Button>
        <Button style={{ marginRight: 12 }} onClick={() => setTheme('dark')}>Dark</Button>
      </div>
      <BoardGrid layout={layout} onSave={(saveLayout) => { console.log(saveLayout); }} />
      <PureBoardGrid layout={layout} showOptions />
    </div>
  );
}

export default App;
