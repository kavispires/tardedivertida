import clsx from 'clsx';
// Images
import items from 'assets/images/alien-items.svg';
// Sass
import './ItemCard.scss';

type ItemCardProps = {
  /**
   * The id of the item
   */
  id: string;
  /**
   * The width of the item
   */
  width?: number;
  /**
   * Optional class name
   */
  className?: string;
};

export function ItemCard({ id, width = 75, className = '' }: ItemCardProps) {
  return (
    <div className={clsx('item-card', className)} style={{ width: `${width}px`, height: `${width}px` }}>
      <svg viewBox="0 0 512 512" style={{ width: `${width - 12}px`, height: `${width - 12}px` }}>
        <use href={items + `#item-${id}`}></use>
      </svg>
    </div>
  );
}
