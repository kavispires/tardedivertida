import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Components
import { LoadingPage } from 'components/loaders';
// Internal
import Home from './Home/Home';
import Login from './Login/Login';
// Routes Lazy load
const Me = lazy(() => import('pages/Me/Me' /* webpackChunkName: "page-me" */));
const Users = lazy(() => import('pages/Me/Users' /* webpackChunkName: "page-users" */));
const Hub = lazy(() => import('pages/Hub/Hub' /* webpackChunkName: "page-hub" */));
const Game = lazy(() => import('pages/Game/Game' /* webpackChunkName: "page-game" */));
const Showcase = lazy(() => import('pages/Showcase/Showcase' /* webpackChunkName: "page-showcase" */));
const TestArea = lazy(() => import('pages/TestArea/TestArea' /* webpackChunkName: "page-test-area" */));
const DevIcons = lazy(() => import('pages/Dev/Icons' /* webpackChunkName: "page-dev-icons" */));
const DevColors = lazy(() => import('pages/Dev/Colors' /* webpackChunkName: "page-dev-colors" */));
const DevSprites = lazy(() => import('pages/Dev/Sprites' /* webpackChunkName: "page-dev-sprites" */));
const DevPlayground = lazy(
  () => import('pages/Dev/Playground' /* webpackChunkName: "page-dev-playground" */),
);
const Daily = lazy(() => import('pages/Daily/Daily' /* webpackChunkName: "page-td-daily" */));

const LazyMe = () => (
  <Suspense fallback={<LoadingPage />}>
    <Me />
  </Suspense>
);
const LazyHub = () => (
  <Suspense fallback={<LoadingPage />}>
    <Hub />
  </Suspense>
);
const LazyUsers = () => (
  <Suspense fallback={<LoadingPage />}>
    <Users />
  </Suspense>
);
const LazyGame = () => (
  <Suspense fallback={<LoadingPage />}>
    <Game />
  </Suspense>
);
const LazyShowcase = () => (
  <Suspense fallback={<LoadingPage />}>
    <Showcase />
  </Suspense>
);
const LazyTestArea = () => (
  <Suspense fallback={<LoadingPage />}>
    <TestArea />
  </Suspense>
);
const LazyDevIcons = () => (
  <Suspense fallback={<LoadingPage />}>
    <DevIcons />
  </Suspense>
);
const LazyDevColors = () => (
  <Suspense fallback={<LoadingPage />}>
    <DevColors />
  </Suspense>
);
const LazyDevSprites = () => (
  <Suspense fallback={<LoadingPage />}>
    <DevSprites />
  </Suspense>
);
const LazyDevPlayground = () => (
  <Suspense fallback={<LoadingPage />}>
    <DevPlayground />
  </Suspense>
);
const LazyDaily = () => (
  <Suspense fallback={<LoadingPage />}>
    <Daily />
  </Suspense>
);
const LazyDiario = () => (
  <Suspense fallback={<LoadingPage />}>
    <Daily />
  </Suspense>
);

/**
 * Wraps admin components that are exclusive to Administrators
 */
function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading } = useCurrentUserContext();

  if (isLoading) {
    return <LoadingPage />;
  }

  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
}

export const routes = (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/me" element={<LazyMe />} />
    <Route path="/eu" element={<LazyMe />} />
    <Route path="/diario/*" element={<LazyDiario />} />
    <Route path="/daily/*" element={<LazyDaily />} />

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
      path="/dev/playground"
      element={
        <AdminProtectedRoute>
          <LazyDevPlayground />
        </AdminProtectedRoute>
      }
    />

    <Route
      path="/dev/users"
      element={
        <AdminProtectedRoute>
          <LazyUsers />
        </AdminProtectedRoute>
      }
    />

    <Route path="/test" element={<LazyTestArea />} />
    <Route path="/teste" element={<LazyTestArea />} />
    <Route path="/showcase" element={<LazyShowcase />} />
    <Route path="/vitrine" element={<LazyShowcase />} />

    <Route path="*" element={<LazyGame />} />
  </Routes>
);
