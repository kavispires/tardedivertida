// Types
import type { TextCardData } from 'types/tdr';
// Icons
import { CheckMarkIcon } from '@icons/CheckMarkIcon';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { TextCard } from '@components/cards/TextCard';
import { Icon } from '@components/general/Icon';
import { SpaceContainer } from '@components/layout/SpaceContainer';

type EvaluationAllDescriptorsProps = {
  cards: Dictionary<TextCardData>;
  onSelect: (cardId: UID) => void;
  descriptorsIds: UID[];
  activeItem: UID;
  matchedItems: Dictionary<boolean>;
};

export function EvaluationAllDescriptors({
  cards,
  onSelect,
  descriptorsIds,
  activeItem,
  matchedItems,
}: EvaluationAllDescriptorsProps) {
  return (
    <SpaceContainer
      size="small"
      wrap
    >
      {descriptorsIds.map((descriptorId) => (
        <TransparentButton
          key={descriptorId}
          onClick={() => onSelect(descriptorId)}
          active={activeItem === descriptorId}
          className="sda-word-button"
        >
          {matchedItems[descriptorId] && (
            <Icon
              icon={<CheckMarkIcon />}
              className="sda-word-button__matched"
            />
          )}
          <TextCard>{cards[descriptorId].text}</TextCard>
        </TransparentButton>
      ))}
    </SpaceContainer>
  );
}
