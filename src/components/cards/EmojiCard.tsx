import clsx from 'clsx';
// Components
import { Sprite } from 'components/sprites';
// Sass
import './EmojiCard.scss';

type EmojiCardProps = {
  /**
   * The id of the emoji
   */
  id: string;
  /**
   * The width of the emoji
   */
  width?: number;
  /**
   * Optional class name
   */
  className?: string;
};

/**
 * An emoji card component.
 */
export function EmojiCard({ id, width, className }: EmojiCardProps): JSX.Element {
  const emojiId = id.startsWith('emoji') ? id : `emoji-${id}`;

  return (
    <div className={clsx('emoji-card', className)} style={{ width: `${width}px`, height: `${width}px` }}>
      <Sprite source="emojis" id={emojiId} width={width} />
    </div>
  );
}
