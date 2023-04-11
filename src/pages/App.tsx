import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
// Ant Design Resources
import { ConfigProvider, Layout, message } from 'antd';
// Firebase
import { auth } from 'services/firebase';
// State
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
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
  const [isLoading, setIsLoading] = useState(true);
  const { translate } = useLanguage();
  const [, setIsAuthenticated] = useGlobalState('isAuthenticated');
  const [, setBlurEnabled] = useGlobalState('blurEnabled');
  const [, setVolume] = useGlobalState('volume');
  const [, setIsAdmin] = useGlobalState('isAdmin');
  const [, setIsAdminEnabled] = useGlobalState('isAdminEnabled');
  const [getLocalStorage] = useLocalStorage();
  // const [theme] = useGlobalState('theme');

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
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "'Lato', sans-serif",
          },
        }}
      >
        <Layout className="app background" id="app">
          <LoadingBar />
          <HashRouter>{isLoading ? <LoadingPage message="..." /> : routes}</HashRouter>
        </Layout>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
