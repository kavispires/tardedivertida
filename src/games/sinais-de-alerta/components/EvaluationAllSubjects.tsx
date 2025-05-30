// Types
import type { TextCard } from 'types/tdr';
// Icons
import { CheckMarkIcon } from 'icons/CheckMarkIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { SpaceContainer } from 'components/layout/SpaceContainer';

type EvaluationAllSubjectsProps = {
  cards: Dictionary<TextCard>;
  onSelect: (cardId: CardId) => void;
  subjectsIds: CardId[];
  activeItem: CardId;
  matchedItems: BooleanDictionary;
};

export function EvaluationAllSubjects({
  cards,
  onSelect,
  subjectsIds,
  activeItem,
  matchedItems,
}: EvaluationAllSubjectsProps) {
  return (
    <SpaceContainer size="small" wrap>
      {subjectsIds.map((subjectId) => (
        <TransparentButton
          key={subjectId}
          onClick={() => onSelect(subjectId)}
          active={activeItem === subjectId}
          className="sda-word-button"
        >
          {matchedItems[subjectId] && (
            <IconAvatar icon={<CheckMarkIcon />} className="sda-word-button__matched" />
          )}
          <Card hideHeader>{cards[subjectId].text}</Card>
        </TransparentButton>
      ))}
    </SpaceContainer>
  );
}
