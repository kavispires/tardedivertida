import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createHashRouter, RouterProvider } from 'react-router-dom';
// Ant Design Resources
import { ConfigProvider, App as AntApp } from 'antd';
// Hooks
import { useAppSetup } from 'hooks/useAppSetup';
// Services
import { AuthProvider } from 'services/AuthProvider';
// Components
import { RouteError } from 'components/errors';
// Internal
import { AnimatedRoutes, routes } from './Routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY, // TODO: Verify
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Create the router with our routes
const router = createHashRouter([
  {
    path: '/',
    element: <AnimatedRoutes />,
    errorElement: <RouteError />,
    children: routes,
  },
]);

function App() {
  // Set up default like username, avatar, canvasSize
  useAppSetup();
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        modal={{
          mask: {
            blur: false,
          },
        }}
        drawer={{
          mask: {
            blur: false,
          },
        }}
        theme={{
          token: {
            fontFamily: "'Lato', sans-serif",
          },
        }}
      >
        <AntApp>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
