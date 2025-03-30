// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { TransparentButton } from 'components/buttons';
import { CrimeItemBackgroundCard, CrimeItemCard } from 'components/cards/CrimeItemCard';
// Internal
import type { GroupedItems, ItemsDict } from '../utils/types';

const getEliminatedCard = (cardType: string) => ({
  id: `dmhk-${cardType === 'ev' ? 'ev' : 'wp'}-xxx`,
  type: cardType,
  name: {
    pt: '-',
    en: '-',
  },
});

type SelectableGroupedItemsBoardProps = {
  groupedItems: GroupedItems;
  items: ItemsDict;
  weaponId?: string;
  evidenceId?: string;
  onSelectItem: (itemId: string) => void;
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
  const cardWidth = useCardWidth(12, { gap: 8, minWidth: 50, maxWidth: 96 });

  return (
    <ul className="h-grouped-items-board" style={activeColor ? { backgroundColor: activeColor } : {}}>
      {Object.keys(groupedItems).map((key, index) => {
        const group = groupedItems[key];
        const isGroupWrong = wrongGroups.includes(index);

        return (
          <li key={`group-${key}`}>
            <ul
              className="h-grouped-items-board__group"
              style={activeColor ? { borderColor: activeColor } : {}}
            >
              {group.map((itemId) => (
                <li key={itemId}>
                  <TransparentButton
                    onClick={isLocked || isGroupWrong ? undefined : () => onSelectItem(itemId)}
                    hoverType="tint"
                    disabled={isGroupWrong}
                  >
                    {isGroupWrong ? (
                      <CrimeItemBackgroundCard id="x" cardWidth={cardWidth} />
                    ) : (
                      <CrimeItemCard
                        item={isGroupWrong ? getEliminatedCard(itemId.split('-')[1]) : items[itemId]}
                        cardWidth={cardWidth}
                        isSelected={[weaponId, evidenceId].includes(itemId)}
                        activeColor={activeColor}
                      />
                    )}
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
