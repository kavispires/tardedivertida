// Types
import type { TextCard } from 'types/tdr';
// Icons
import { CheckMarkIcon } from '@icons/CheckMarkIcon';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { Card } from '@components/cards/Card';
import { Icon } from '@components/general/Icon';
import { SpaceContainer } from '@components/layout/SpaceContainer';

type EvaluationAllDescriptorsProps = {
  cards: Dictionary<TextCard>;
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
          <Card hideHeader>{cards[descriptorId].text}</Card>
        </TransparentButton>
      ))}
    </SpaceContainer>
  );
}
