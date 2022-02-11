import clsx from 'clsx';
// Utils
import { LETTERS } from '../../utils/constants';
import { getEntryId } from '../../utils/helpers';
// Components
import { ArteRuimCard as Card } from './Card';

type EvaluationAllCardsProps = {
  cards: ArteRuimCard[];
  activeItem: string;
  onActivateItem: GenericFunction;
  votes: PlainObject;
};

export function EvaluationAllCards({ cards, activeItem, onActivateItem, votes }: EvaluationAllCardsProps) {
  const liButtonBaseClass = 'a-evaluation-all-cards__li-card-button';

  return (
    <ul className="a-evaluation-all-cards">
      {cards.map((cardEntry, index) => {
        const letter = LETTERS[index];
        const cardEntryId = getEntryId(['card', cardEntry.id, letter]);
        const isActive = activeItem === cardEntryId;
        const isUsed = Object.values(votes).includes(cardEntryId);

        return (
          <li
            role="button"
            key={cardEntryId}
            className={clsx(
              liButtonBaseClass,
              isActive && `${liButtonBaseClass}--active`,
              isUsed && `${liButtonBaseClass}--used`
            )}
            onClick={() => onActivateItem(cardEntryId)}
          >
            <Card text={cardEntry.text} level={cardEntry.level} header={letter} />
          </li>
        );
      })}
    </ul>
  );
}
