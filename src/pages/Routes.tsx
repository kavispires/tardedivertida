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
const Me = lazy(() => import('pages/Me/Me' /* webpackChunkName: "page-me" */));
const Users = lazy(() => import('pages/Me/Users' /* webpackChunkName: "page-users" */));
const Hub = lazy(() => import('pages/Hub/Hub' /* webpackChunkName: "page-hub" */));
const Game = lazy(() => import('pages/Game/Game' /* webpackChunkName: "page-game" */));
const Showcase = lazy(() => import('pages/Showcase/Showcase' /* webpackChunkName: "page-showcase" */));
const TestArea = lazy(() => import('pages/TestArea/TestArea' /* webpackChunkName: "page-test-area" */));
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
const DevDailySetup = lazy(
  () => import('pages/Dev/DailySetup/DailySetup' /* webpackChunkName: "page-dev-daily-setup" */)
);
const Daily = lazy(() => import('pages/Daily/Daily' /* webpackChunkName: "page-td-daily" */));
const ImageCardsCategorizer = lazy(
  () =>
    import(
      'pages/Dev/ImageCards/ImageCardsCategorizer' /* webpackChunkName: "page-dev-image-cards-categorizer" */
    )
);
const ImageCardsRelationships = lazy(
  () =>
    import('pages/Dev/ImageCards/ImageCardsPage' /* webpackChunkName: "page-dev-image-cards-relationships" */)
);
const ConnectItems = lazy(
  () => import('pages/Dev/ConnectItems/ConnectItems' /* webpackChunkName: "page-dev-connect-items" */)
);
const ConnectTrio = lazy(
  () => import('pages/Dev/ConnectItems/ConnectTrioPage' /* webpackChunkName: "page-td-connect-trio" */)
);

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
const LazyDevResources = () => (
  <Suspense fallback={<LoadingPage />}>
    <DevResources />
  </Suspense>
);
const LazyDevPlayground = () => (
  <Suspense fallback={<LoadingPage />}>
    <DevPlayground />
  </Suspense>
);
const LazyDevClassifier = () => (
  <Suspense fallback={<LoadingPage />}>
    <DevClassifier />
  </Suspense>
);
const LazyDevDailySetup = () => (
  <Suspense fallback={<LoadingPage />}>
    <DevDailySetup />
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
const LazyImageCardsCategorizer = () => (
  <Suspense fallback={<LoadingPage />}>
    <ImageCardsCategorizer />
  </Suspense>
);
const LazyImageCardsRelationships = () => (
  <Suspense fallback={<LoadingPage />}>
    <ImageCardsRelationships />
  </Suspense>
);
const LazyConnectItems = () => (
  <Suspense fallback={<LoadingPage />}>
    <ConnectItems />
  </Suspense>
);
const LazyConnectTrio = () => (
  <Suspense fallback={<LoadingPage />}>
    <ConnectTrio />
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
    <Route path="/diario" element={<LazyDiario />} />
    <Route path="/daily" element={<LazyDaily />} />

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
    <Route
      path="/dev/dailysetup"
      element={
        <AdminProtectedRoute>
          <LazyDevDailySetup />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/dev/imagecardscategorizer"
      element={
        <AdminProtectedRoute>
          <LazyImageCardsCategorizer />
        </AdminProtectedRoute>
      }
    />
    <Route
      path="/dev/imagecardsrelationships"
      element={
        <AdminProtectedRoute>
          <LazyImageCardsRelationships />
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

    <Route
      path="/dev/connectitems"
      element={
        <AdminProtectedRoute>
          <LazyConnectItems />
        </AdminProtectedRoute>
      }
    />

    <Route
      path="/trio"
      element={
        <AdminProtectedRoute>
          <LazyConnectTrio />
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
