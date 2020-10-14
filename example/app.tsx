import React from 'react';
import { BoardGrid, setLocale, getLocale, getTheme, setTheme } from '../src/index';
import layout from './mock/data';
import { useMount } from 'react-use';

function App() {
  console.log('current locale:', getLocale());
  console.log('current theme:', getTheme());
  useMount(() => {
    // console.log('change locale to en');
    // setLocale('en');
  });

  return (
    <div>
      <div style={{ float: 'right' }}>
        语言：
        <button onClick={() => setLocale('zh')}>中文</button>
        <button onClick={() => setLocale('en')}>English</button>
        主题：
        <button onClick={() => setTheme('dice')}>Dice</button>
        <button onClick={() => setTheme('dark')}>Dark</button>
      </div>
      <BoardGrid layout={layout} onSave={(saveLayout: any) => { console.log(saveLayout); }} />
    </div>
  );
}

export default App;
