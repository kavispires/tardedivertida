import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Utils
import { LETTERS } from '../../utils/constants';
import { getEntryId } from '../../utils';
// Components
import { SonhosPesadelosCard as Card } from '../../components/cards';

function AllClues({ clues, activeItem, onActivateItem, votes, players }) {
  const liButtonBaseClass = 'a-evaluation-all-cards__li-card-button';

  return (
    <ul className="a-evaluation-all-cards">
      {clues.map(({ cardId, clue, playerId }, index) => {
        const letter = LETTERS[index];
        const cardEntryId = getEntryId(['clue', cardId, letter]);
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
            <Card
              clue={clue[0]}
              header={letter}
              footer={players[playerId].name}
              previousClues={clue.slice(1)}
            />
          </li>
        );
      })}
    </ul>
  );
}

AllClues.propTypes = {
  activeItem: PropTypes.string,
  clues: PropTypes.arrayOf(
    PropTypes.shape({
      cardId: PropTypes.string,
      clue: PropTypes.array,
    })
  ),
  onActivateItem: PropTypes.func,
  onActiveItem: PropTypes.func,
  votes: PropTypes.object,
};

export default AllClues;
