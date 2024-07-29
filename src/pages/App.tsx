import { useEffectOnce } from 'react-use';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLocalStorage } from 'react-use';
// Ant Design Resources
import { ConfigProvider, Layout, App as AntApp } from 'antd';
// Services
import { AuthProvider } from 'services/AuthProvider';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useError } from 'hooks/useError';
import { useAppSetup } from 'hooks/useAppSetup';
// State
import { useGlobalState } from 'hooks/useGlobalState';
// Components
import { LoadingBar, LoadingPage } from 'components/loaders';
import { PageError } from 'components/errors';
// Pages
import { routes } from './Routes';
import ErrorBoundary from 'components/errors/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // TODO: Verify
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  const [, setUsername] = useGlobalState('username');
  const [, setUserAvatarId] = useGlobalState('userAvatarId');
  const [localUsername] = useLocalStorage('username', '');
  const [localAvatarId] = useLocalStorage('avatarId', '');

  useEffectOnce(() => {
    setUsername(localUsername ?? '');
    setUserAvatarId(localAvatarId ?? '');
  });

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
  const { isLoading } = useCurrentUserContext();
  const { isError, errors } = useError();
  useAppSetup();

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
