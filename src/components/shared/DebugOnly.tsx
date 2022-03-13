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
    return isDevEnv ? <div>{children}</div> : <></>;
  }

  if ((dev && isDevEnv) || isDebugEnabled) {
    if (div) {
      return <div>{children}</div>;
    }
    return <>{children}</>;
  }
  return <></>;
}
