import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

// Design Resources
import { Layout, message, Spin } from 'antd';
// Firebase
import { auth } from '../services/firebase';
// State
import useGlobalState from '../states/useGlobalState';
// Pages
import Home from './Home';
import Admin from './Admin';
import Login from './Login';
import Game from './Game';
import LoadingPage from './loaders/LoadingPage';
import LoadingBar from './loaders/LoadingBar';

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
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoading(false);
        setIsAuthenticated(true);
        message.info('Você foi logado de volta automaticamente.');
      } else {
        setIsLoading(false);
        setIsAuthenticated(false);
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
            <PrivateRoute path="/admin" authenticated={isAuthenticated} component={Admin} />
            <PublicRoute path="/login" authenticated={isAuthenticated} component={Login}></PublicRoute>
            <Route path="*" component={Game} />
          </Switch>
        )}
      </Router>
    </Layout>
  );
}

export default App;
