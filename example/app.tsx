import React from 'react';
import { BoardGrid, setLocale, getLocale } from '../src/index';
import layout from './mock/data';
import { useMount } from 'react-use';

function App() {
  console.log('current locale:', getLocale());
  useMount(() => {
    setLocale('en');
  });

  return (
    <div>
      <div style={{ float: 'right' }}>
        <button onClick={() => setLocale('zh')}>中文</button>
        <button onClick={() => setLocale('en')}>English</button>
      </div>
      <BoardGrid layout={layout} isEN onSave={(saveLayout: any) => { console.log(saveLayout); }} />
    </div>
  );
}

export default App;
