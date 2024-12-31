// Hooks
import { useLoading } from 'hooks/useLoading';

export function LoadingBar() {
  const { isLoading } = useLoading();
  return isLoading ? <div className="loading-bar"></div> : <></>;
}
