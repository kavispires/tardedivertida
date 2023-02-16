import { ReactNode } from 'react';

type ViewOrProps = {
  /**
   * The content of the component to be toggled
   */
  children: [ReactNode, ReactNode];
  /**
   * The condition to be met to render the first children
   */
  condition?: boolean;
};

/**
 * View wrapper that renders one of two children depending on a condition
 */
export function ViewOr({ condition = false, children }: ViewOrProps) {
  return condition ? <>{children[0]}</> : <>{children[1]}</>;
}
