import { USE_DEV } from '@dev-configs';
import type { ReactNode } from 'react';
// Hooks
import { useDevFeatures } from '@hooks/useDevFeatures';

type DebugOnlyProps = {
  /**
   * Enables debug mode only in development environment
   */
  dev?: boolean;
  /**
   * During development, it will always be visible
   */
  devOnly?: boolean;
  /**
   * Wraps content in a div
   */
  div?: boolean;
  /**
   * The content of the component
   */
  children: ReactNode;
};

/**
 * Wrapper component that conditionally renders children based on debug mode or development environment
 */
export function DebugOnly({ children, div = false, dev = false, devOnly = false }: DebugOnlyProps) {
  const { isDebugEnabled, isDevEnv } = useDevFeatures();

  if (devOnly && USE_DEV) {
    if (div && isDevEnv) {
      return <div>{children}</div>;
    }

    return isDevEnv ? children : null;
  }

  if ((dev && isDevEnv && USE_DEV) || isDebugEnabled) {
    if (div) {
      return <div>{children}</div>;
    }
    return <>{children}</>;
  }
  return null;
}
