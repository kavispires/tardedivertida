import { useCardWidth } from '../../hooks';
import { ItemCard } from './ItemCard';

type GroupedItemsBoardProps = {
  groupedItems: GroupedItems;
  items: ItemsDict;
  weaponId?: string;
  evidenceId?: string;
};

export function GroupedItemsBoard({ items, weaponId, evidenceId, groupedItems }: GroupedItemsBoardProps) {
  const cardWidth = useCardWidth(12, 8, 30, 200);
  return (
    <ul className="h-grouped-items-board">
      {Object.values(groupedItems).map((group, index) => (
        <li key={`group-${index}`}>
          <ul className="h-grouped-items-board__group">
            {group.map((itemId) => (
              <li key={itemId}>
                <ItemCard
                  item={items[itemId]}
                  cardWidth={cardWidth}
                  isSelected={[weaponId, evidenceId].includes(itemId)}
                />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
