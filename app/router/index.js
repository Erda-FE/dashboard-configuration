import React from 'react';
import { forEach } from 'lodash';
import { Router, Switch, Route } from 'dva/router';
import dynamic from 'dva/dynamic';

const PageContainer = ({ children }) => children;

class AppRouter extends React.PureComponent {
  componentWillMount() {
    this.initChildRoutes();
  }

  initChildRoutes = () => {
    const routeHandlers = [

    ];
    this.childRoutes = [];
    const { app } = this.props;
    routeHandlers.forEach(handler => forEach(handler(), ({ getComponent, ...other }) => this.childRoutes.push({
      ...other,
      Comp: dynamic({
        app,
        component: getComponent,
      }),
    })));
  }

  render() {
    const { history } = this.props;
    return (
      <Router history={history} >
        <Switch>
          <Route
            path="/"
            render={props => (<PageContainer {...props}>
              <Switch>
                {this.childRoutes.map(({ path, Comp }) => (
                  <Route
                    key={path}
                    path={path}
                    render={childProps => <Comp {...childProps} />}
                  />
                ))}
              </Switch>
            </PageContainer>)}
          />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
