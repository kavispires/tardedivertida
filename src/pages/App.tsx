import { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

// Ant Design Resources
import { Layout, message } from 'antd';
// Firebase
import { auth } from 'services/firebase';
// State
import { useGlobalState, useLanguage, useLocalStorage } from 'hooks';
// Components
import { LoadingBar, LoadingPage } from 'components/loaders';
// Pages
import Home from './Home/Home';
import Login from './Login/Login';

// Routes Lazy load
const Hub = lazy(() => import('pages/Hub/Hub' /* webpackChunkName: "page-hub" */));
const Game = lazy(() => import('pages/Game/Game' /* webpackChunkName: "page-game" */));
const Showcase = lazy(() => import('pages/Showcase/Showcase' /* webpackChunkName: "page-showcase" */));
const DevIcons = lazy(() => import('pages/Dev/Icons' /* webpackChunkName: "page-dev-icons" */));
const DevTestingZone = lazy(
  () => import('pages/Dev/TestingZone' /* webpackChunkName: "page-dev-testing-zone" */)
);

const LazyHub = () => (
  <Suspense fallback={<LoadingPage message={''} />}>
    <Hub />
  </Suspense>
);
const LazyGame = () => (
  <Suspense fallback={<LoadingPage message={''} />}>
    <Game />
  </Suspense>
);
const LazyShowcase = () => (
  <Suspense fallback={<LoadingPage message={''} />}>
    <Showcase />
  </Suspense>
);
const LazyDevIcons = () => (
  <Suspense fallback={<LoadingPage message={''} />}>
    <DevIcons />
  </Suspense>
);
const LazyDevTestingZone = () => (
  <Suspense fallback={<LoadingPage message={''} />}>
    <DevTestingZone />
  </Suspense>
);

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
            <Route path="/hub" element={isAuthenticated ? <LazyHub /> : <Navigate to="/login" />} />
            <Route path="/icons" element={isAuthenticated ? <LazyDevIcons /> : <Navigate to="/login" />} />
            <Route
              path="/testing-zone"
              element={isAuthenticated ? <LazyDevTestingZone /> : <Navigate to="/login" />}
            />
            <Route path="/showcase" element={<LazyShowcase />} />
            <Route path="/vitrine" element={<LazyShowcase />} />
            <Route path="*" element={<LazyGame />} />
          </Routes>
        )}
      </HashRouter>
    </Layout>
  );
}

export default App;