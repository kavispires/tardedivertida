import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

// Design Resources
import { Layout } from 'antd';
// Pages
import Home from './Home';
import Admin from './Admin';
import Login from './Login';
import Game from './Game';

function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  const fromPath = rest?.location?.state?.from?.pathname ?? '/';
  return (
    <Route
      {...rest}
      render={(props) => (authenticated === false ? <Component {...props} /> : <Redirect to={fromPath} />)}
    />
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Layout className="app">
      <Router>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <PrivateRoute path="/admin" authenticated={isAuthenticated} component={Admin} />
          <PublicRoute path="/login" authenticated={isAuthenticated} component={Login}></PublicRoute>
          <PublicRoute path="*" authenticated={isAuthenticated} component={Game}></PublicRoute>
        </Switch>
      </Router>
    </Layout>
  );
}

export default App;
