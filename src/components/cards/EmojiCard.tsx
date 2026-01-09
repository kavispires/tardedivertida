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
  emojiId: string;
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
} & ElementProps;

/**
 * An emoji card component.
 */
export function EmojiCard({
  emojiId,
  width = DEFAULT_SPRITE_SIZE,
  padding = DEFAULT_PADDING,
  className,
  ...rest
}: EmojiCardProps) {
  const id = emojiId.startsWith('emoji') ? emojiId : `emoji-${emojiId}`;

  const divPadding = padding === 0 ? { padding: 0 } : {};

  return (
    <div
      {...rest}
      className={clsx('emoji-card', className)}
      style={{ ...rest.style, width: `${width}px`, height: `${width}px`, ...divPadding }}
    >
      <Sprite
        source="emojis"
        spriteId={id}
        width={width}
        padding={padding}
      />
    </div>
  );
}

/**
 * An emoji sprite component.
 */
export function EmojiSprite({
  emojiId,
  width = DEFAULT_SPRITE_SIZE,
  ...props
}: Pick<EmojiCardProps, 'emojiId' | 'width'> & ElementProps) {
  const id = emojiId.startsWith('emoji') ? emojiId : `emoji-${emojiId}`;
  return (
    <Sprite
      source="emojis"
      spriteId={id}
      width={width}
      padding={0}
      {...props}
    />
  );
}
