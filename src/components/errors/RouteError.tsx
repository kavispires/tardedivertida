import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
// Internal
import { PageError } from './PageError';

/**
 * Route-level error component for React Router
 * Catches errors that occur during route rendering or data loading
 */
export function RouteError() {
  const error = useRouteError();

  // biome-ignore lint/suspicious/noConsole: Error logging is acceptable here
  console.error('Route error:', error);

  // Check if it's a route error response (4xx/5xx responses)
  if (isRouteErrorResponse(error)) {
    return (
      <PageError
        message={`${error.status} ${error.statusText}`}
        description={error.data?.message || 'An error occurred while loading this page'}
      />
    );
  }

  // Handle regular errors
  if (error instanceof Error) {
    return <PageError message="Route Error" description={error.message} />;
  }

  // Handle unknown errors
  return <PageError message="Unknown Error" description="An unexpected error occurred" />;
}
