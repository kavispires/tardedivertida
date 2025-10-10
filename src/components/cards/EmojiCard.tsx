import clsx from 'clsx';
// Utils
import { DEFAULT_PADDING } from 'utils/constants';
// Components
import { DEFAULT_SPRITE_SIZE, Sprite } from 'components/sprites';
// Sass
import './EmojiCard.scss';

type EmojiCardProps = {
  /**
   * The id of the emoji
   */
  id: string;
  /**
   * The width of the emoji (default: 72)
   */
  width?: number;
  /**
   * The padding size
   */
  padding?: number;
  /**
   * Optional class name
   */
  className?: string;
};

/**
 * An emoji card component.
 */
export function EmojiCard({
  id,
  width = DEFAULT_SPRITE_SIZE,
  padding = DEFAULT_PADDING,
  className,
}: EmojiCardProps) {
  const emojiId = id.startsWith('emoji') ? id : `emoji-${id}`;

  const divPadding = padding === 0 ? { padding: 0 } : {};

  return (
    <div
      className={clsx('emoji-card', className)}
      style={{ width: `${width}px`, height: `${width}px`, ...divPadding }}
    >
      <Sprite source="emojis" spriteId={emojiId} width={width} padding={padding} />
    </div>
  );
}

/**
 * An emoji sprite component.
 */
export function EmojiSprite({
  id,
  width = DEFAULT_SPRITE_SIZE,
  ...props
}: Pick<EmojiCardProps, 'id' | 'width'> & ElementProps) {
  const emojiId = id.startsWith('emoji') ? id : `emoji-${id}`;
  return <Sprite source="emojis" spriteId={emojiId} width={width} padding={0} {...props} />;
}
