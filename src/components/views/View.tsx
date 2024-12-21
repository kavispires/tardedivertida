import type { ReactNode } from 'react';

type ViewProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
};

export function View({ children }: ViewProps) {
  return <>{children}</>;
}
