import clsx from 'clsx';
// Components
import { Sprite } from 'components/sprites';
// Sass
import './GlyphCard.scss';

type GlyphCardProps = {
  /**
   * The id of the glyph
   */
  id: number | string;
  /**
   * The width of the glyph
   */
  width?: number;
  /**
   * Optional class name
   */
  className?: string;
};

const BASE = 128;

/**
 * Retrieves the source and glyph ID based on a given string.
 *
 * @param str - The input string.
 * @returns An array containing the source and glyph ID.
 */
const getSource = (numId: number) => {
  const glyphId = `glyph-${numId}`;
  const sourceId = Math.ceil(numId / BASE) * BASE;
  const source = `glyphs-${sourceId}`;
  return [source, glyphId];
};

/**
 * A glyph card component.
 */
export function GlyphCard({ id, width, className }: GlyphCardProps) {
  const [source, glyphId] = getSource(+id);

  return (
    <div className={clsx('glyph-card', className)} style={{ width: `${width}px`, height: `${width}px` }}>
      <Sprite source={source} id={glyphId} width={width} padding={0} />
    </div>
  );
}
