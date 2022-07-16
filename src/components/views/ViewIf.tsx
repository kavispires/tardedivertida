import { ReactNode } from 'react';

type ViewIfProps = {
  /**
   * The content of the component
   */
  children: ReactNode;
  isVisible?: boolean;
};

export function ViewIf({ isVisible = false, children }: ViewIfProps) {
  return isVisible ? <>{children}</> : <></>;
}
