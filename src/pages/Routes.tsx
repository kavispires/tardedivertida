import { lazy, Suspense, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Components
import { LoadingPage } from 'components/loaders';
// Pages
import Home from './Home/Home';
import Login from './Login/Login';
// Routes Lazy load
const Hub = lazy(() => import('pages/Hub/Hub' /* webpackChunkName: "page-hub" */));
const Game = lazy(() => import('pages/Game/Game' /* webpackChunkName: "page-game" */));
const Showcase = lazy(() => import('pages/Showcase/Showcase' /* webpackChunkName: "page-showcase" */));
const DevIcons = lazy(() => import('pages/Dev/Icons' /* webpackChunkName: "page-dev-icons" */));
const DevColors = lazy(() => import('pages/Dev/Colors' /* webpackChunkName: "page-dev-colors" */));
const DevSprites = lazy(() => import('pages/Dev/Sprites' /* webpackChunkName: "page-dev-sprites" */));
const DevResources = lazy(() => import('pages/Dev/Resources' /* webpackChunkName: "page-dev-resources" */));
const DevPlayground = lazy(
  () => import('pages/Dev/Playground' /* webpackChunkName: "page-dev-playground" */)
);
const DevClassifier = lazy(
  () => import('pages/Dev/Classifier/ItemClassifier' /* webpackChunkName: "page-dev-classifier" */)
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
const LazyDevColors = () => (
  <Suspense fallback={<LoadingPage message={''} />}>
    <DevColors />
  </Suspense>
);
const LazyDevSprites = () => (
  <Suspense fallback={<LoadingPage message={''} />}>
    <DevSprites />
  </Suspense>
);
const LazyDevResources = () => (
  <Suspense fallback={<LoadingPage message={''} />}>
    <DevResources />
  </Suspense>
);
const LazyDevPlayground = () => (
  <Suspense fallback={<LoadingPage message={''} />}>
    <DevPlayground />
  </Suspense>
);
const LazyDevClassifier = () => (
  <Suspense fallback={<LoadingPage message={''} />}>
    <DevClassifier />
  </Suspense>
);

/**
 * Wraps admin components that are exclusive to Administrators
 */
function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading } = useCurrentUserContext();

  if (isLoading) {
    return <LoadingPage message="Loading..." />;
  }

  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
}

export const routes = (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route
      path="/hub"
      element={
        <AdminProtectedRoute>
          <LazyHub />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/dev/icons"
      element={
        <AdminProtectedRoute>
          <LazyDevIcons />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/dev/colors"
      element={
        <AdminProtectedRoute>
          <LazyDevColors />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/dev/sprites"
      element={
        <AdminProtectedRoute>
          <LazyDevSprites />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/dev/resources"
      element={
        <AdminProtectedRoute>
          <LazyDevResources />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/dev/playground"
      element={
        <AdminProtectedRoute>
          <LazyDevPlayground />
        </AdminProtectedRoute>
      }
    />

    <Route
      path="/dev/classifier"
      element={
        <AdminProtectedRoute>
          <LazyDevClassifier />
        </AdminProtectedRoute>
      }
    />

    <Route path="/showcase" element={<LazyShowcase />} />
    <Route path="/vitrine" element={<LazyShowcase />} />
    <Route path="*" element={<LazyGame />} />
  </Routes>
);
