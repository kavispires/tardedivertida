// Hooks
import { CrimeItemCard } from 'components/cards/CrimeItemCard';
import { useCardWidth } from 'hooks/useCardWidth';

type GroupedItemsBoardProps = {
  groupedItems: GroupedItems;
  items: ItemsDict;
  weaponId?: string;
  evidenceId?: string;
};

export function GroupedItemsBoard({ items, weaponId, evidenceId, groupedItems }: GroupedItemsBoardProps) {
  const cardWidth = useCardWidth(12, { gap: 8, minWidth: 30, maxWidth: 200 });
  return (
    <ul className="h-grouped-items-board">
      {Object.values(groupedItems).map((group, index) => (
        <li key={`group-${index}`}>
          <ul className="h-grouped-items-board__group">
            {group.map((itemId) => (
              <li key={itemId}>
                <CrimeItemCard
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
