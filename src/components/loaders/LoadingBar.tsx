// Hooks
import { useLoading } from 'hooks/useLoading';

export function LoadingBar(): JSX.Element {
  const { isLoading } = useLoading();

  return isLoading ? <div className="loading-bar"></div> : <></>;
}
