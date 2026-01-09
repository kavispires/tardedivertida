import { AnimatePresence } from 'motion/react';
import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation, type RouteObject } from 'react-router-dom';
// Ant Design Resources
import { App as AntApp } from 'antd';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useError } from 'hooks/useError';
import { useGlobalState } from 'hooks/useGlobalState';
// Components
import { PageError } from 'components/errors';
import { LoadingBar, LoadingPage } from 'components/loaders';
// Internal
import Home from './Home/Home';
import Login from './Login/Login';
// Routes Lazy load
const Me = lazy(() => import('pages/Me/Me' /* webpackChunkName: "page-me" */));
const Users = lazy(() => import('pages/Me/Users' /* webpackChunkName: "page-users" */));
const Hub = lazy(() => import('pages/Hub/Hub' /* webpackChunkName: "page-hub" */));
const Game = lazy(() => import('pages/Game/Game' /* webpackChunkName: "page-game" */));
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

  return isAdmin ? children : <Navigate to="/login" />;
}

// Layout component for the admin routes
function AdminLayout() {
  return (
    <AdminProtectedRoute>
      <Outlet />
    </AdminProtectedRoute>
  );
}

// Main routes configuration using the new RouteObject structure
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/me',
    element: <LazyMe />,
  },
  {
    path: '/eu',
    element: <LazyMe />,
  },
  {
    path: '/diario/*',
    element: <LazyDiario />,
  },
  {
    path: '/daily/*',
    element: <LazyDaily />,
  },
  {
    path: '/hub',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <LazyHub />,
      },
    ],
  },
  {
    path: '/dev',
    element: <AdminLayout />,
    children: [
      {
        path: 'icons',
        element: <LazyDevIcons />,
      },
      {
        path: 'colors',
        element: <LazyDevColors />,
      },
      {
        path: 'sprites',
        element: <LazyDevSprites />,
      },
      {
        path: 'playground',
        element: <LazyDevPlayground />,
      },
      {
        path: 'users',
        element: <LazyUsers />,
      },
    ],
  },
  {
    path: '/test',
    element: <LazyTestArea />,
  },
  {
    path: '/teste',
    element: <LazyTestArea />,
  },
  {
    path: '*',
    element: <LazyGame />,
  },
];

// AnimatedRoutes is still used for the animation wrapper
export const AnimatedRoutes = () => {
  const { notification } = AntApp.useApp();
  const location = useLocation();
  const { isLoading: isUserLoading, isAuthenticating } = useCurrentUserContext();
  const { isError, errors } = useError();
  const [usingFirestoreEmulator] = useGlobalState('usingFirestoreEmulator');
  const [usingFunctionsEmulator] = useGlobalState('usingFunctionsEmulator');

  // biome-ignore lint/correctness/useExhaustiveDependencies: Not the function, just the value
  useEffect(() => {
    if (usingFirestoreEmulator) {
      notification.warning({
        title: `Emulando Firestore para ${usingFirestoreEmulator}`,
        placement: 'topLeft',
      });
    }
  }, [usingFirestoreEmulator]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Not the function, just the value
  useEffect(() => {
    if (usingFunctionsEmulator) {
      notification.warning({
        title: `Emulando Functions para ${usingFunctionsEmulator}`,
        placement: 'topLeft',
      });
    }
  }, [usingFunctionsEmulator]);

  // Daily games shouldn't be held hostage of the user loading state
  const shouldSkipLoading = location.pathname.includes('/diario') || location.pathname.includes('/daily');
  const isLoading = isAuthenticating || (!shouldSkipLoading && isUserLoading);

  return (
    <div
      className="app background"
      id="app"
    >
      <LoadingBar />
      {isError && <PageError description={Object.values(errors).join(', ')} />}
      {isLoading && <LoadingPage />}
      {!isError && !isLoading && (
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      )}
    </div>
  );
};
