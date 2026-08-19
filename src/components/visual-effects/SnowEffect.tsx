// Sass
import styles from './SnowEffect.module.scss';

const snowflakes = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  left: `${(index * 7 + 4) % 100}%`,
  size: 12 + ((index * 7) % 22),
  duration: `${8 + (index % 7)}s`,
  delay: `${-(index * 0.9)}s`,
  opacity: 0.3 + (index % 5) * 0.14,
}));

/**
 * Component that renders an animated snowfall effect
 */
export function SnowEffect() {
  return (
    <div
      className={styles.initialSnow}
      aria-hidden="true"
    >
      {snowflakes.map(({ id, left, size, duration, delay, opacity }) => (
        <div
          key={id}
          className={styles.snow}
          style={{
            left,
            animationDuration: duration,
            animationDelay: delay,
            fontSize: `${size}px`,
            opacity,
          }}
        >
          &#10052;
        </div>
      ))}
    </div>
  );
}
