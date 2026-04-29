import type { ReactNode } from 'react';

type ViewSwitchProps = {
  /**
   * Array of boolean conditions to determine which child to render
   */
  cases: boolean[];
  /**
   * The content of the component
   */
  children: ReactNode[];
};

/**
 * Conditional view switcher that renders children based on corresponding boolean cases
 */
export function ViewSwitch({ cases, children }: ViewSwitchProps) {
  if (cases.length > 5) {
    throw Error('ViewSwitch only supports up to 5 cases');
  }

  if (cases[0] && children[0]) {
    return children[0];
  }

  if (cases[1] && children[1]) {
    return children[1];
  }

  if (cases[2] && children[2]) {
    return children[2];
  }

  if (cases[3] && children[3]) {
    return children[3];
  }

  if (cases[4] && children[4]) {
    return children[4];
  }
  // biome-ignore lint/suspicious/noConsole: on purpose for debugging
  console.error('Rendering all children in the ViewSwitch');
  return children;
}
