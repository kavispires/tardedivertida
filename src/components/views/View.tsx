import type { ReactNode } from 'react';

type ViewProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
};

/**
 * Simple wrapper component that renders children within a React fragment
 */
export function View({ children }: ViewProps) {
  return <>{children}</>;
}
