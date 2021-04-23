import React from 'react';
import { HashRouter as Router } from 'react-router-dom';

// Design Resources
import { Layout } from 'antd';
import Home from './Home';

function App() {
  return (
    <Layout className="app">
      <Router>
        <Home />
      </Router>
    </Layout>
  );
}

export default App;
