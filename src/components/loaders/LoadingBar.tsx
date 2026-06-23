// Hooks
import { useLoading } from '@hooks/useLoading';
// Sass
import styles from './loaders.module.scss';

/**
 * Top loading bar indicator that displays when global loading state is active
 */
export function LoadingBar() {
  const { isLoading } = useLoading();
  return isLoading ? <div className={styles.loadingBar}></div> : <></>;
}
