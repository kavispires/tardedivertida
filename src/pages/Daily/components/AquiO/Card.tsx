import clsx from 'clsx';
import { ItemCard } from 'components/cards/ItemCard';

import { AcheIssoCard } from 'pages/Daily/utils/types';

type CardProps = {
  card: AcheIssoCard;
  onSelect: (itemId: string) => void;
  width: number;
  className: string;
};
export function Card({ card, onSelect, width, className }: CardProps) {
  return (
    <div
      className={clsx('ache-isso-card', className)}
      // ref={ref}
      style={{ width: width, height: width }}
    >
      {card.items.map((item) => (
        <div
          key={item.itemId}
          className={clsx('ache-isso-card-item', `ache-isso-card-item--pos-${item.position}`)}
          style={{
            transform: `rotate(${item.rotation}deg) scale(${item.size / 100})`,
          }}
          role="button"
          onClick={() => onSelect(item.itemId)}
        >
          <ItemCard id={item.itemId} className="ache-isso-card-sprite" width={width / 4} />
        </div>
      ))}
    </div>
  );
}

type PreloadItemsProps = {
  items: string[];
};

export function PreloadItems({ items }: PreloadItemsProps) {
  return (
    <div style={{ display: 'none' }}>
      {items.map((itemId) => (
        <ItemCard key={itemId} id={itemId} className="transparent" width={1} />
      ))}
    </div>
  );
}
