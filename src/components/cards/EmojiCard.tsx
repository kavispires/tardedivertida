import clsx from 'clsx';
// Images
import emojis from 'assets/images/emojis.svg';
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

export function EmojiCard({ id, width = 75, className = '' }: EmojiCardProps) {
  return (
    <div className={clsx('emoji-card', className)} style={{ width: `${width}px`, height: `${width}px` }}>
      <svg viewBox="0 0 512 512" style={{ width: `${width - 12}px`, height: `${width - 12}px` }}>
        <use href={emojis + `#emoji-${id}`}></use>
      </svg>
    </div>
  );
}
