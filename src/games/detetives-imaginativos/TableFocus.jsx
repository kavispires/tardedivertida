import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Spin } from 'antd';
// Utils
import { AVATARS } from '../../utils/constants';
// Components
import { ImageCard } from '../../components/cards';
import { Avatar } from '../../components/avatars';
import { useDimensions } from '../../hooks';

export function TableFocus({ table, currentPlayer }) {
  const tableEntry = table.find((entry) => entry.playerId === currentPlayer.id);
  const baseClass = 'd-table';
  const [width] = useDimensions();

  if (!currentPlayer || !tableEntry?.cards) {
    return (
      <div className={clsx(baseClass, `${baseClass}--center`)}>
        <Spin />
      </div>
    );
  }

  return (
    <div className={clsx(baseClass, `${baseClass}--center`)}>
      <div className="d-table__player-entry">
        <div className="d-table__cards">
          {tableEntry?.cards.map((cardId) => {
            return (
              <ImageCard
                key={`table-focous-${cardId}`}
                imageId={cardId}
                cardWidth={Math.max(200, Math.min(400, width / 6))}
                className="d-table__card"
              />
            );
          })}
        </div>
        <div className="d-table__player-info">
          <Avatar id={currentPlayer.avatarId} className="d-table__player-avatar" size="medium" />
          <span
            className="d-table__player-bar"
            style={{ backgroundColor: AVATARS[currentPlayer.avatarId].color }}
          />
          <span className="d-table__player-name">{currentPlayer.name}</span>
        </div>
      </div>
    </div>
  );
}

TableFocus.propTypes = {
  currentPlayer: PropTypes.shape({
    avatarId: PropTypes.string,
    name: PropTypes.string,
  }),
  table: PropTypes.arrayOf(
    PropTypes.shape({
      playerId: PropTypes.string,
      cards: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};

export default TableFocus;
