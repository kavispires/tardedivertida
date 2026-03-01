// Hooks
import { useLoading } from 'hooks/useLoading';
// Sass
import styles from './loaders.module.scss';
// Styles

export function LoadingBar() {
  const { isLoading } = useLoading();
  return isLoading ? <div className={styles.loadingBar}></div> : <></>;
}
