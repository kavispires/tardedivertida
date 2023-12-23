import { Component } from 'react';
import { PageError } from './PageError';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <PageError description="Kaboom!" />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
