// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CrimeItemCard } from 'components/cards/CrimeItemCard';
// Internal
import type { GroupedItems, ItemsDict } from '../utils/types';

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
      {Object.keys(groupedItems).map((groupKey) => (
        <li
          key={`group-${groupKey}`}
          className="reset-li"
        >
          <ul className="h-grouped-items-board__group">
            {groupedItems[groupKey].map((itemId) => (
              <li
                key={itemId}
                className="reset-li"
              >
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
