import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Utils
import { LETTERS } from '../../../utils/constants';
// Components
import { ArteRuimCard as Card } from '../../cards';

function EvaluationAllCards({ cards, activeItem, onActivateItem, votes }) {
  const liButtonBaseClass = 'a-evaluation-all-cards__li-card-button';

  return (
    <ul className="a-evaluation-all-cards">
      {cards.map((cardEntry, index) => {
        const letter = LETTERS[index];
        const cardEntryId = `card-${cardEntry.id}-${letter}`;
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

EvaluationAllCards.propTypes = {
  activeItem: PropTypes.string,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
  onActivateItem: PropTypes.func,
  onActiveItem: PropTypes.func,
  votes: PropTypes.object,
};

export default EvaluationAllCards;
