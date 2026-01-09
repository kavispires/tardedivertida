import React from 'react';
// Internal
import { PageError } from './PageError';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details in development
    // biome-ignore lint/suspicious/noConsole: Error logging is acceptable here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    // You could also log to an error reporting service here
    // logErrorToService(error, errorInfo);

    this.setState({ errorInfo });
  }

  render(): React.ReactNode {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <PageError
          message="Something went wrong"
          description={error?.message || 'Kaboom!'}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
