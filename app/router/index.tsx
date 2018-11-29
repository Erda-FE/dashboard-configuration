import React from 'react';
import { Router, Switch, Route } from 'dva/router';
import dynamic from 'dva/dynamic';
import AppLayout from 'layout/base';
import { History } from 'interface/common';

interface IProps {
  app: any
  history: History
}

class AppRouter extends React.PureComponent<IProps> {
  childRoutes: any[] = [];

  componentWillMount() {
    this.initChildRoutes();
  }

  initChildRoutes = () => {
    const routeHandlers: any[] = [];
    const { app } = this.props;
    routeHandlers.forEach(({ getComponent, ...other }) => this.childRoutes.push({
      ...other,
      Comp: dynamic({
        app,
        component: getComponent,
      } as any),
    }));
  }

  render() {
    const { history } = this.props;
    return (
      <Router history={history} >
        <Switch>
          <Route
            path="/"
            render={props => (<AppLayout {...props}>
              <Switch>
                {this.childRoutes.map(({ path, Comp }: any) => (
                  <Route
                    key={path}
                    path={path}
                    render={childProps => <Comp {...childProps} />}
                  />
                ))}
              </Switch>
            </AppLayout>)}
          />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
