import clsx from 'clsx';
// Components
import { ItemCard } from 'components/cards/ItemCard';
// Internal
import type { AquiODisc } from '../utils/types';

type DiscProps = {
  disc: AquiODisc;
  onSelect: (itemId: string) => void;
  width: number;
  className: string;
};
export function Disc({ disc, onSelect, width, className }: DiscProps) {
  return (
    <div className={clsx('aqui-o-disc', className)} style={{ width: width, height: width }}>
      {disc.items.map((item) => (
        <div
          key={item.itemId}
          className={clsx('aqui-o-disc-item', `aqui-o-disc-item--pos-${item.position}`)}
          style={{
            transform: `rotate(${item.rotation}deg) scale(${item.size / 100})`,
            zIndex: item.zIndex,
          }}
          role="button"
          onClick={() => onSelect(item.itemId)}
        >
          <ItemCard id={item.itemId} className="aqui-o-disc-sprite" width={width / 4} />
        </div>
      ))}
    </div>
  );
}
