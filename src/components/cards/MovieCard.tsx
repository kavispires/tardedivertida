import clsx from 'clsx';
// Types
import type { MovieCardData as MovieCardType } from 'types/tdr';
// Sass
import styles from './MovieCardData.module.scss';

type MovieCardProps = {
  /**
   * The movie card data object
   */
  movie: MovieCardType;
  /**
   * Whether to disable the suffix portion of the card
   */
  disableSuffix?: boolean;
  /**
   * Custom color for the suffix
   */
  suffixColor?: string;
  /**
   * Whether to disable the prefix portion of the card
   */
  disablePrefix?: boolean;
  /**
   * Custom color for the prefix
   */
  prefixColor?: string;
};

/**
 * Displays a movie card with customizable prefix and suffix colors
 */
export function MovieCard({ movie, disableSuffix, disablePrefix, prefixColor, suffixColor }: MovieCardProps) {
  return (
    <div className={styles.movieCard}>
      <div
        className={clsx(styles.movieCardSuffix, disableSuffix && styles.movieCardSuffixDisabled)}
        style={{ backgroundColor: !disableSuffix && suffixColor ? suffixColor : 'rgba(248, 248, 248, 0.6)' }}
      >
        <span style={{ fontSize: movie.suffix.length > 25 ? '0.8em' : '1em' }}>{movie.suffix}</span>
      </div>

      <div
        className={clsx(styles.movieCardPrefix, disablePrefix && styles.movieCardPrefixDisabled)}
        style={{ backgroundColor: !disablePrefix && prefixColor ? prefixColor : 'rgba(248, 248, 248, 0.6)' }}
      >
        <span style={{ fontSize: movie.prefix.length > 25 ? '0.8em' : '1em' }}>{movie.prefix}</span>
      </div>
    </div>
  );
}
