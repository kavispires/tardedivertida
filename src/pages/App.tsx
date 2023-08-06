import { useEffectOnce } from 'react-use';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
// Ant Design Resources
import { ConfigProvider, Layout } from 'antd';
// Services
import { AuthProvider } from 'services/AuthProvider';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useError } from 'hooks/useError';
// State
import { useGlobalState } from 'hooks/useGlobalState';
import { useLocalStorage } from 'hooks/useLocalStorage';
// Components
import { LoadingBar, LoadingPage } from 'components/loaders';
import { PageError } from 'components/errors';
// Pages
import { routes } from './Routes';

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
  const [, setBlurEnabled] = useGlobalState('blurEnabled');
  const [, setVolume] = useGlobalState('volume');
  const [, setUsername] = useGlobalState('username');
  const [, setUserAvatarId] = useGlobalState('userAvatarId');
  const [getLocalStorage] = useLocalStorage();

  useEffectOnce(() => {
    setBlurEnabled(getLocalStorage('blurEnabled') || false);
    setVolume(getLocalStorage('volume') ?? 0.5);
    setUsername(getLocalStorage('username'));
    setUserAvatarId(getLocalStorage('avatarId'));
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "'Lato', sans-serif",
          },
        }}
      >
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

function AppLayout() {
  const { isLoading } = useCurrentUserContext();
  const { isError, errors } = useError();

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
