import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import BoardGrid from '../src/grid';
import layout from './mock/data';

const history = createBrowserHistory();
function App() {
  return (
    <Router history={history}>
      <Route
        path="*"
        render={childProps => <BoardGrid isEN {...childProps} layout={layout} onSave={(saveLayout: any) => { console.log(saveLayout); }} />}
      />
    </Router>
  );
}

export default App;
