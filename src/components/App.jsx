import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

// Design Resources
import { Layout, message } from 'antd';
// Firebase
import { auth } from '../services/firebase';
// State
import { useGlobalState } from '../hooks';
// Pages
import Home from './Home';
import Hub from './Hub';
import Login from './Login';
import Game from './Game';
import TestingZone from './TestingZone';
import { LoadingBar, LoadingPage } from './loaders';
import { isDevEnv } from '../utils';

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
  const [, setIsAdmin] = useGlobalState('isAdmin');

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoading(false);
        setIsAuthenticated(true);
        setIsAdmin(true);
        message.info('Você foi logado de volta automaticamente.');
      } else {
        setIsLoading(false);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    });
  }, []); // eslint-disable-line

  return (
    <Layout className="app">
      <LoadingBar />
      <Router>
        {isLoading ? (
          <LoadingPage />
        ) : (
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <PrivateRoute path="/hub" authenticated={isAuthenticated} component={Hub} />
            <PublicRoute path="/login" authenticated={isAuthenticated} component={Login} />
            <PrivateRoute path="/testing-zone" authenticated={isAuthenticated} component={TestingZone} />

            <Route path="*" component={Game} />
          </Switch>
        )}
      </Router>
    </Layout>
  );
}

export default App;
