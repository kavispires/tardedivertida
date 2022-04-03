import { useDevFeatures } from 'hooks';

type DebugOnlyProps = {
  dev?: boolean;
  devOnly?: boolean;
  div?: boolean;
  children: ReactChildren;
};

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
  return <></>;
}
