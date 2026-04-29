// Sass
import styles from './FireworksEffect.module.scss';

/**
 * Component that renders an animated fireworks effect
 */
export function FireworksEffect() {
  return (
    <div className={styles.fireworks}>
      <div className={styles.fireworksBefore}></div>
      <div className={styles.fireworksAfter}></div>
    </div>
  );
}
