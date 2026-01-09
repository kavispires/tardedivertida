// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { TransparentButton } from 'components/buttons';
import { CrimeItemBackgroundCard, CrimeItemCard } from 'components/cards/CrimeItemCard';
// Internal
import type { GroupedItems, ItemsDict } from '../utils/types';
import { CARD_TYPE_BY_CODE } from '../utils/constants';

const getEliminatedCard = (cardCode: keyof typeof CARD_TYPE_BY_CODE) => {
  const cardType = CARD_TYPE_BY_CODE[cardCode] ?? '';
  return {
    id: `dmhk-${cardCode}-xxx`,
    type: cardType,
    name: {
      pt: '-',
      en: '-',
    },
    itemId: '0',
  };
};

type SelectableGroupedItemsBoardProps = {
  groupedItems: GroupedItems;
  items: ItemsDict;
  weaponId?: string;
  evidenceId?: string;
  victimId?: string;
  locationId?: string;
  onSelectItem: (itemId: string) => void;
  activeColor?: string;
  isLocked?: boolean;
  wrongGroups?: number[];
  wrongItems?: string[];
};

export function SelectableGroupedItemsBoard({
  items,
  weaponId,
  evidenceId,
  victimId,
  locationId,
  groupedItems,
  onSelectItem,
  activeColor,
  isLocked,
  wrongGroups = [],
  wrongItems = [],
}: SelectableGroupedItemsBoardProps) {
  const cardWidth = useCardWidth(12, { gap: 8, minWidth: 50, maxWidth: 96 });

  return (
    <ul
      className="h-grouped-items-board"
      style={activeColor ? { backgroundColor: activeColor } : {}}
    >
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
                    {isGroupWrong || wrongItems.includes(itemId) ? (
                      <CrimeItemBackgroundCard
                        id="x"
                        cardWidth={cardWidth}
                      />
                    ) : (
                      <CrimeItemCard
                        item={isGroupWrong ? getEliminatedCard(itemId.split('-')[1]) : items[itemId]}
                        cardWidth={cardWidth}
                        isSelected={[weaponId, evidenceId, victimId, locationId].includes(itemId)}
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
