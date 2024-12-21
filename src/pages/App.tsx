import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter } from 'react-router-dom';
import { useLocation } from 'react-use';
// Ant Design Resources
import { ConfigProvider, Layout, App as AntApp } from 'antd';
// Hooks
import { useAppSetup } from 'hooks/useAppSetup';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useError } from 'hooks/useError';
// Services
import { AuthProvider } from 'services/AuthProvider';
// Components
import { PageError } from 'components/errors';
import ErrorBoundary from 'components/errors/ErrorBoundary';
import { LoadingBar, LoadingPage } from 'components/loaders';
// Internal
import { routes } from './Routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY, // TODO: Verify
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  // Set up default like username, avatar, canvasSize
  useAppSetup();
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: "'Lato', sans-serif",
            },
          }}
        >
          <AntApp>
            <AuthProvider>
              <AppLayout />
            </AuthProvider>
          </AntApp>
        </ConfigProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function AppLayout() {
  useAppSetup();
  const { isLoading: isUserLoading, isAuthenticating } = useCurrentUserContext();
  const { isError, errors } = useError();
  // Use location from react-use to bypass the need of the router context
  const location = useLocation();
  // Daily games shouldn't be held hostage of the user loading state
  const isLoading = isAuthenticating || (!location?.hash?.includes('diario') && isUserLoading);

  return (
    <Layout className="app background" id="app">
      <LoadingBar />
      <HashRouter>
        {isError && <PageError description={Object.values(errors).join(', ')} />}
        {isLoading && <LoadingPage />}
        {!isError && !isLoading && routes}
      </HashRouter>
    </Layout>
  );
}

export default App;
