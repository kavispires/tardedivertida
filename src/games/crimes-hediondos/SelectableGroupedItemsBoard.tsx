import { TransparentButton } from '../../components';
import { useCardWidth } from '../../hooks';
import { ItemCard } from './ItemCard';

type SelectableGroupedItemsBoardProps = {
  groupedItems: GroupedItems;
  items: ItemsDict;
  weaponId?: string;
  evidenceId?: string;
  onSelectItem: GenericFunction;
  activeColor?: string;
};

export function SelectableGroupedItemsBoard({
  items,
  weaponId,
  evidenceId,
  groupedItems,
  onSelectItem,
  activeColor,
}: SelectableGroupedItemsBoardProps) {
  const cardWidth = useCardWidth(12, 8, 30, 200);
  return (
    <ul className="h-grouped-items-board">
      {Object.values(groupedItems).map((group, index) => (
        <li key={`group-${index}`}>
          <ul
            className="h-grouped-items-board__group"
            style={Boolean(activeColor) ? { borderColor: activeColor } : {}}
          >
            {group.map((itemId) => (
              <li key={itemId}>
                <TransparentButton onClick={() => onSelectItem(itemId)}>
                  <ItemCard
                    item={items[itemId]}
                    cardWidth={cardWidth}
                    isSelected={[weaponId, evidenceId].includes(itemId)}
                    preview={false}
                    activeColor={activeColor}
                  />
                </TransparentButton>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
