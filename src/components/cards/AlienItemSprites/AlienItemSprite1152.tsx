import clsx from 'clsx';
// Images
import items from 'assets/images/alien-items-1152.svg';
// Types
import type { ItemCardProps } from '../ItemCard';

function AliemItemSprite1152({ id, width = 75, className = '' }: ItemCardProps) {
  return (
    <div className={clsx('item-card', className)} style={{ width: `${width}px`, height: `${width}px` }}>
      <svg viewBox="0 0 512 512" style={{ width: `${width - 12}px`, height: `${width - 12}px` }}>
        <use href={items + `#item-${id}`}></use>
      </svg>
    </div>
  );
}

export default AliemItemSprite1152;
