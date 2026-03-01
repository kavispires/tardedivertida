// Sass
import styles from './FireworksEffect.module.scss';

export function FireworksEffect() {
  return (
    <div className={styles.fireworks}>
      <div className={styles.fireworksBefore}></div>
      <div className={styles.fireworksAfter}></div>
    </div>
  );
}
