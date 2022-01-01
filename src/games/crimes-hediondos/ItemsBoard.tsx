import { useCardWidth } from '../../hooks';
import { ItemCard } from './ItemCard';

type ItemsBoardProps = {
  items: ItemsDict;
  weaponId?: string;
  evidenceId?: string;
};

export function ItemsBoard({ items, weaponId, evidenceId }: ItemsBoardProps) {
  const cardWidth = useCardWidth(12, 8, 30, 200);
  return (
    <ul className="h-items-board">
      {Object.values(items).map((item) => (
        <li key={item.id}>
          <ItemCard item={item} cardWidth={cardWidth} isSelected={[weaponId, evidenceId].includes(item.id)} />
        </li>
      ))}
    </ul>
  );
}
