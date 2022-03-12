import { useDevFeatures } from 'hooks';

type DebugOnlyProps = {
  dev?: boolean;
  div?: boolean;
  children: ReactChildren;
};

export function DebugOnly({ children, div = false, dev = false }: DebugOnlyProps) {
  const { isDebugEnabled, isDevEnv } = useDevFeatures();

  if ((dev && isDevEnv) || isDebugEnabled) {
    if (div) {
      return <div>{children}</div>;
    }
    return <>{children}</>;
  }
  return <></>;
}
