import { useEffectOnce } from 'react-use';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
// Ant Design Resources
import { ConfigProvider, Layout } from 'antd';
// Services
import { AuthProvider } from 'services/AuthProvider';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// State
import { useGlobalState } from 'hooks/useGlobalState';
import { useLocalStorage } from 'hooks/useLocalStorage';
// Components
import { LoadingBar, LoadingPage } from 'components/loaders';
// Pages
import { routes } from './Routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // TODO: Verify
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [, setBlurEnabled] = useGlobalState('blurEnabled');
  const [, setVolume] = useGlobalState('volume');
  const [getLocalStorage] = useLocalStorage();

  useEffectOnce(() => {
    setBlurEnabled(getLocalStorage('blurEnabled') || false);
    setVolume(getLocalStorage('volume') ?? 0.5);
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
  return (
    <Layout className="app background" id="app">
      <LoadingBar />
      <HashRouter>{isLoading ? <LoadingPage message="..." /> : routes}</HashRouter>
    </Layout>
  );
}

export default App;
