import clsx from 'clsx';
// Types
import type { MovieCard as MovieCardType } from 'types/tdr';
// Sass
import './MovieCard.scss';

type MovieCardProps = {
  movie: MovieCardType;
  disableSuffix?: boolean;
  suffixColor?: string;
  disablePrefix?: boolean;
  prefixColor?: string;
};

export function MovieCard({ movie, disableSuffix, disablePrefix, prefixColor, suffixColor }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div
        className={clsx('movie-card__suffix', disableSuffix && 'movie-card__suffix--disabled')}
        style={{ backgroundColor: !disableSuffix && suffixColor ? suffixColor : 'rgba(248, 248, 248, 0.6)' }}
      >
        <span style={{ fontSize: movie.suffix.length > 25 ? '0.8em' : '1em' }}>{movie.suffix}</span>
      </div>

      <div
        className={clsx('movie-card__prefix', disablePrefix && 'movie-card__prefix--disabled')}
        style={{ backgroundColor: !disablePrefix && prefixColor ? prefixColor : 'rgba(248, 248, 248, 0.6)' }}
      >
        <span style={{ fontSize: movie.prefix.length > 25 ? '0.8em' : '1em' }}>{movie.prefix}</span>
      </div>
    </div>
  );
}
