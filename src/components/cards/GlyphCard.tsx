import clsx from 'clsx';
// Images
import glyphs from 'assets/images/glyphs.svg';
// Sass
import './GlyphCard.scss';

type GlyphCardProps = {
  /**
   * The id of the glyph
   */
  id: string;
  /**
   * The width of the glyph
   */
  width?: number;
  /**
   * Optional class name
   */
  className?: string;
};

export function GlyphCard({ id, width = 75, className = '' }: GlyphCardProps) {
  return (
    <div className={clsx('glyph-card', className)} style={{ width: `${width}px`, height: `${width}px` }}>
      <svg viewBox="0 0 512 512" style={{ width: `${width - 12}px`, height: `${width - 12}px` }}>
        <use href={glyphs + `#glyph-${id}`}></use>
      </svg>
    </div>
  );
}
