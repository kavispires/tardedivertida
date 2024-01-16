// Types
import type { ObjectCardObj } from '../utils/types';
// Components
import { ItemCard } from 'components/cards/ItemCard';
import { DualTranslate } from 'components/language';

type ObjectCardProps = {
  item: ObjectCardObj;
};

export function ObjectCard({ item }: ObjectCardProps) {
  return (
    <div className="object-card">
      <ItemCard id={item.id} />
      <span className="object-card__name">
        <DualTranslate>{item.name}</DualTranslate>
      </span>
    </div>
  );
}
