import clsx from 'clsx';
// Utils
import { DEFAULT_PADDING } from 'utils/constants';
// Components
import { DEFAULT_SPRITE_SIZE, Sprite } from 'components/sprites';
// Sass
import './GlyphCard.scss';

type GlyphCardProps = {
  /**
   * The id of the glyph
   */
  glyphId: number | string;
  /**
   * The width of the glyph (default: 72)
   */
  width?: number;
  /**
   * Optional class name
   */
  className?: string;
  /**
   * Optional padding
   */
  padding?: number;
} & ElementProps;

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
export function GlyphCard({
  glyphId,
  width = DEFAULT_SPRITE_SIZE,
  padding = DEFAULT_PADDING,
  className,
  ...rest
}: GlyphCardProps) {
  const [source, id] = getSource(+glyphId);

  const divPadding = padding === 0 ? { padding: 0 } : {};

  return (
    <div
      {...rest}
      className={clsx('glyph-card', className)}
      style={{ ...rest.style, width: `${width}px`, height: `${width}px`, ...divPadding }}
    >
      <Sprite source={source} spriteId={id} width={width} padding={padding} />
    </div>
  );
}

/**
 * A glyph sprite component.
 */
export function GlyphSprite({
  glyphId,
  width = DEFAULT_SPRITE_SIZE,
  ...props
}: Pick<GlyphCardProps, 'glyphId' | 'width'> & ElementProps) {
  const [source, id] = getSource(+glyphId);
  return <Sprite source={source} spriteId={id} width={width} padding={0} {...props} />;
}
