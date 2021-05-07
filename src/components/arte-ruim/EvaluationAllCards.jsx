import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Utils
import { LETTERS } from '../../utils/constants';
// Components
import Card from '../cards/ArteRuimCard';

function EvaluationAllCards({ cards, activeItem, onActivateItem, votes }) {
  return (
    <ul className="evaluation-phase__all-cards">
      {cards.map((cardEntry, index) => {
        const letter = LETTERS[index];
        const cardEntryId = `card-${cardEntry.id}-${letter}`;
        return (
          <li
            key={cardEntryId}
            className={clsx(
              'evaluation-phase__li-card-button',
              activeItem === cardEntryId && 'evaluation-phase__li-card-button--active',
              Object.values(votes).includes(cardEntryId) && 'evaluation-phase__li-card-button--used'
            )}
            onClick={() => onActivateItem(cardEntryId)}
          >
            <Card id={cardEntry.id} header={letter} />
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
  onActiveItem: PropTypes.func,
  votes: PropTypes.object,
};

export default EvaluationAllCards;
