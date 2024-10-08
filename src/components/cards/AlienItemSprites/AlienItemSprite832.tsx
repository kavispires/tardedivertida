import clsx from 'clsx';
// Internal
import type { ItemCardProps } from '../ItemCard';
// Images
import items from 'assets/images/alien-items-832.svg';

function AliemItemSprite832({ id, width = 75, className = '', title }: ItemCardProps) {
  return (
    <div className={clsx('item-card', className)} style={{ width: `${width}px`, height: `${width}px` }}>
      <svg viewBox="0 0 512 512" style={{ width: `${width - 12}px`, height: `${width - 12}px` }}>
        <use href={items + `#item-${id}`}>{title && <title>{title}</title>}</use>
      </svg>
    </div>
  );
}

export default AliemItemSprite832;
