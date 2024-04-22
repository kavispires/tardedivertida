import clsx from 'clsx';
import { ItemCard } from 'components/cards/ItemCard';

import { AcheIssoDisc } from 'pages/Daily/utils/types';

type DiscProps = {
  disc: AcheIssoDisc;
  onSelect: (itemId: string) => void;
  width: number;
  className: string;
};
export function Disc({ disc, onSelect, width, className }: DiscProps) {
  return (
    <div
      className={clsx('ache-isso-disc', className)}
      // ref={ref}
      style={{ width: width, height: width }}
    >
      {disc.items.map((item) => (
        <div
          key={item.itemId}
          className={clsx('ache-isso-disc-item', `ache-isso-disc-item--pos-${item.position}`)}
          style={{
            transform: `rotate(${item.rotation}deg) scale(${item.size / 100})`,
          }}
          role="button"
          onClick={() => onSelect(item.itemId)}
        >
          <ItemCard id={item.itemId} className="ache-isso-disc-sprite" width={width / 4} />
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
