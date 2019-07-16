import React from 'react';
import { Router, Switch, Route } from 'dva/router';
import { History } from 'interface/common';
import BoardGrid from '../../src/board-grid';
import layout from '../mock/data';

interface IProps {
  app: any
  history: History
}

class AppRouter extends React.PureComponent<IProps> {
  render() {
    const { history } = this.props;
    return (
      <Router history={history} >
        <Switch>
          <Route
            path="*"
            render={childProps => <BoardGrid {...childProps} layout={layout} />}
          />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
