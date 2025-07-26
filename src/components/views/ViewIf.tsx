import type { ReactNode } from 'react';

type ViewIfProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Displays children only if condition is truthy
   */
  condition?: boolean;
};

/**
 * Wrapper component that only renders the children if the condition is truthy
 */
export function ViewIf({ condition = false, children }: ViewIfProps) {
  return condition ? children : null;
}
