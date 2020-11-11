import React from 'react';
import { BoardGrid, PureBoardGrid, setLocale, getLocale, getTheme, setTheme } from '../src/index';
import layout from './mock/data';
import layout2 from './mock/data2';
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
      {/* <BoardGrid layout={layout} onSave={(saveLayout: any) => { console.log(saveLayout); }} /> */}
      <PureBoardGrid layout={layout} showOptions />
      {/* {'>>>>>>>>>>>>>>>>>>>>>>>>>>>sasasa'}
      <PureBoardGrid layout={layout2} showOptions /> */}
    </div>
  );
}

export default App;
