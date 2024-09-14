// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { TransparentButton } from 'components/buttons';
import { CrimeItemCard } from 'components/cards/CrimeItemCard';
// Internal
import type { GroupedItems, ItemsDict } from '../utils/types';

const getEliminatedCard = (cardType: string) => ({
  id: `dmhk-${cardType === 'ev' ? 'ev' : 'wp'}-xxx`,
  type: cardType,
  name: {
    pt: 'x',
    en: 'x',
  },
});

type SelectableGroupedItemsBoardProps = {
  groupedItems: GroupedItems;
  items: ItemsDict;
  weaponId?: string;
  evidenceId?: string;
  onSelectItem: GenericFunction;
  activeColor?: string;
  isLocked?: boolean;
  wrongGroups?: number[];
};

export function SelectableGroupedItemsBoard({
  items,
  weaponId,
  evidenceId,
  groupedItems,
  onSelectItem,
  activeColor,
  isLocked,
  wrongGroups = [],
}: SelectableGroupedItemsBoardProps) {
  const cardWidth = useCardWidth(12, { gap: 8, minWidth: 30, maxWidth: 200 });

  return (
    <ul className="h-grouped-items-board">
      {Object.values(groupedItems).map((group, index) => {
        const isGroupWrong = wrongGroups.includes(index);

        return (
          <li key={`group-${index}`}>
            <ul
              className="h-grouped-items-board__group"
              style={Boolean(activeColor) ? { borderColor: activeColor } : {}}
            >
              {group.map((itemId) => (
                <li key={itemId}>
                  <TransparentButton
                    onClick={isLocked || isGroupWrong ? undefined : () => onSelectItem(itemId)}
                  >
                    <CrimeItemCard
                      item={isGroupWrong ? getEliminatedCard(itemId.split('-')[1]) : items[itemId]}
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
        );
      })}
    </ul>
  );
}
