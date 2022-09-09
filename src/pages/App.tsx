import { useState, lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

// Ant Design Resources
import { Layout, message } from 'antd';
// Firebase
import { auth } from 'services/firebase';
// State
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
import { useLocalStorage } from 'hooks/useLocalStorage';
// Components
import { LoadingBar, LoadingPage } from 'components/loaders';
// Pages
import Home from './Home/Home';
import Login from './Login/Login';
import AvatarsPage from './Dev/Avatars';
import { useEffectOnce } from 'react-use';

// Routes Lazy load
const Hub = lazy(() => import('pages/Hub/Hub' /* webpackChunkName: "page-hub" */));
const Game = lazy(() => import('pages/Game/Game' /* webpackChunkName: "page-game" */));
const Showcase = lazy(() => import('pages/Showcase/Showcase' /* webpackChunkName: "page-showcase" */));
const DevIcons = lazy(() => import('pages/Dev/Icons' /* webpackChunkName: "page-dev-icons" */));
const DevResources = lazy(() => import('pages/Dev/Resources' /* webpackChunkName: "page-dev-resources" */));
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
const LazyDevAvatars = () => (
  <Suspense fallback={<LoadingPage message={''} />}>
    <AvatarsPage />
  </Suspense>
);
const LazyDevIcons = () => (
  <Suspense fallback={<LoadingPage message={''} />}>
    <DevIcons />
  </Suspense>
);
const LazyDevResources = () => (
  <Suspense fallback={<LoadingPage message={''} />}>
    <DevResources />
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
  const [, setVolume] = useGlobalState('volume');
  const [, setIsAdmin] = useGlobalState('isAdmin');
  const [, setIsAdminEnabled] = useGlobalState('isAdminEnabled');
  const [getLocalStorage] = useLocalStorage();

  useEffectOnce(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setIsAdmin(true);
        setIsAdminEnabled(true);
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
    setVolume(getLocalStorage('volume') ?? 0.5);
  });

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
            <Route
              path="/dev/avatars"
              element={isAuthenticated ? <LazyDevAvatars /> : <Navigate to="/login" />}
            />
            <Route
              path="/dev/icons"
              element={isAuthenticated ? <LazyDevIcons /> : <Navigate to="/login" />}
            />
            <Route
              path="/dev/resources"
              element={isAuthenticated ? <LazyDevResources /> : <Navigate to="/login" />}
            />
            <Route
              path="/dev/testing-zone"
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
