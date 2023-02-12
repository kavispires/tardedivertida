import clsx from 'clsx';
// Images
import signs from 'assets/images/alien-signs.svg';
// Sass
import './GlyphCard.scss';

type GlyphCardProps = {
  /**
   * The id of the sign
   */
  id: string | number;
  /**
   * The width of the sign
   */
  width?: number;
  /**
   * Optional class name
   */
  className?: string;
};

export function SignCard({ id, width = 50, className = '' }: GlyphCardProps) {
  return (
    <div className={clsx('sign-card', className)} style={{ width: `${width}px`, height: `${width}px` }}>
      <svg viewBox="0 0 512 512" style={{ width: `${width - 12}px`, height: `${width - 12}px` }}>
        <use href={signs + `#sign-${id}`}></use>
      </svg>
    </div>
  );
}
