import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Hooks
import { useDimensions } from '../../hooks';
// Components
import ImageCard from '../../components/cards/ImageCard';
import NightmareButton from './NightmareButton';
import DreamButton from './DreamButton';

function DreamBoard({ table, user, className }) {
  const [screenWidth] = useDimensions();
  const cardWidth = Math.round(screenWidth / (table.length / 2)) - 40;
  const baseClass = 's-dream-board-card';

  return (
    <ul className={clsx('s-dream-board', className)}>
      {table.map((entry) => {
        const isDream = Boolean(user.dreams[entry.cardId]);
        const isNightmare = user.nightmares.includes(entry.cardId);

        return (
          <li
            className="s-dream-board-entry"
            key={`board-${entry.cardId}`}
            style={{ maxWidth: `${cardWidth + 20}px` }}
          >
            <ImageCard
              imageId={entry.cardId}
              bordered
              cardWidth={cardWidth}
              className={clsx(
                baseClass,
                isDream && `${baseClass}--dream`,
                isNightmare && `${baseClass}--nightmare`
              )}
            />
            {isNightmare && <NightmareButton />}

            {isDream && <DreamButton />}
          </li>
        );
      })}
    </ul>
  );
}

DreamBoard.propTypes = {
  className: PropTypes.string,
  table: PropTypes.array,
  user: PropTypes.shape({
    dreams: PropTypes.array,
    nightmares: PropTypes.array,
  }),
};

export default DreamBoard;
