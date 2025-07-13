import type { ReactNode } from 'react';
// Hooks
import { useDevFeatures } from 'hooks/useDevFeatures';

type DebugOnlyProps = {
  dev?: boolean;
  devOnly?: boolean;
  div?: boolean;
  /**
   * The content of the component
   */
  children: ReactNode;
};

/**
 * Wrapper component for information only displayed if the debug mode is on
 * @param props
 * @returns
 */
export function DebugOnly({ children, div = false, dev = false, devOnly = false }: DebugOnlyProps) {
  const { isDebugEnabled, isDevEnv } = useDevFeatures();

  if (devOnly) {
    if (div && isDevEnv) {
      return <div>{children}</div>;
    }

    return isDevEnv ? <> {children}</> : <></>;
  }

  if ((dev && isDevEnv) || isDebugEnabled) {
    if (div) {
      return <div>{children}</div>;
    }
    return <>{children}</>;
  }
  return null;
}
