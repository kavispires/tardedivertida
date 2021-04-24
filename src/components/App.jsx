import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

// Design Resources
import { Layout, Spin } from 'antd';
// Firebase
import { auth } from '../services/firebase';
// State
import useGlobalState from '../states/useGlobalState';
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
  const [isAuthenticated, setIsAuthenticated] = useGlobalState('isAuthenticated');

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoading(false);
        setIsAuthenticated(true);
      } else {
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    });
  }, []);

  return (
    <Layout className="app">
      <Router>
        {isLoading ? (
          <Spin />
        ) : (
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <PrivateRoute path="/admin" authenticated={isAuthenticated} component={Admin} />
            <PublicRoute path="/login" authenticated={isAuthenticated} component={Login}></PublicRoute>
            <PublicRoute path="*" authenticated={isAuthenticated} component={Game}></PublicRoute>
          </Switch>
        )}
      </Router>
    </Layout>
  );
}

export default App;
