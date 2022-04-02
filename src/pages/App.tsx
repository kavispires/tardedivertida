import { useState, useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

// Ant Design Resources
import { Layout, message } from 'antd';
// Firebase
import { auth } from 'services/firebase';
// State
import { useGlobalState, useLanguage, useLocalStorage } from 'hooks';
// Components
import { LoadingBar, LoadingPage } from 'components';
// Pages
import Home from './Home/Home';
import Hub from './Hub/Hub';
import Login from './Login/Login';
import Game from './Game/Game';
import Icons from './Dev/Icons';
import TestingZone from './Dev/TestingZone';
import Gallery from './Gallery/Gallery';
import Draw from './Draw/Draw';
import Showcase from './Showcase/Showcase';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { translate } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useGlobalState('isAuthenticated');
  const [, setBlurEnabled] = useGlobalState('blurEnabled');
  const [, setIsAdmin] = useGlobalState('isAdmin');
  const [getLocalStorage] = useLocalStorage();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setIsAdmin(true);
        setIsLoading(false);
        message.info(
          translate('Você foi logado de volta automaticamente.', "You've been logged back in automatically")
        );
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    setBlurEnabled(getLocalStorage('blurEnabled') || false);
  }, []); // eslint-disable-line

  return (
    <Layout className="app" id="app">
      <LoadingBar />
      <HashRouter>
        {isLoading ? (
          <LoadingPage message="..." />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/hub" element={isAuthenticated ? <Hub /> : <Navigate to="/login" />} />
            <Route path="/icons" element={isAuthenticated ? <Icons /> : <Navigate to="/login" />} />
            <Route
              path="/testing-zone"
              element={isAuthenticated ? <TestingZone /> : <Navigate to="/login" />}
            />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/draw" element={<Draw />} />
            <Route path="/showcase" element={<Showcase />} />
            <Route path="/vitrine" element={<Showcase />} />
            <Route path="*" element={<Game />} />
          </Routes>
        )}
      </HashRouter>
    </Layout>
  );
}

export default App;
