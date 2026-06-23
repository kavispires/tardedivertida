// Types
import type { TextCardData } from 'types/tdr';
// Icons
import { CheckMarkIcon } from '@icons/CheckMarkIcon';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { Card } from '@components/cards/Card';
import { Icon } from '@components/general/Icon';
import { SpaceContainer } from '@components/layout/SpaceContainer';

type EvaluationAllSubjectsProps = {
  cards: Dictionary<TextCardData>;
  onSelect: (cardId: UID) => void;
  subjectsIds: UID[];
  activeItem: UID;
  matchedItems: Dictionary<boolean>;
};

export function EvaluationAllSubjects({
  cards,
  onSelect,
  subjectsIds,
  activeItem,
  matchedItems,
}: EvaluationAllSubjectsProps) {
  return (
    <SpaceContainer
      size="small"
      wrap
    >
      {subjectsIds.map((subjectId) => (
        <TransparentButton
          key={subjectId}
          onClick={() => onSelect(subjectId)}
          active={activeItem === subjectId}
          className="sda-word-button"
        >
          {matchedItems[subjectId] && (
            <Icon
              icon={<CheckMarkIcon />}
              className="sda-word-button__matched"
            />
          )}
          <Card hideHeader>{cards[subjectId].text}</Card>
        </TransparentButton>
      ))}
    </SpaceContainer>
  );
}
