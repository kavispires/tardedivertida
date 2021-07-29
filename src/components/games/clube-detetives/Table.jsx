import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Spin } from 'antd';
// Hooks
import { useDimensions } from '../../../hooks';
// Components
import { ImageCard } from '../../cards';
import { Avatar } from '../../avatars';
import { AVATARS } from '../../../utils/constants';

export function Table({ table, players }) {
  const baseClass = 'd-table';
  const [width] = useDimensions();

  if (!table || !table?.length) {
    return (
      <div className={clsx(baseClass, `${baseClass}--center`)}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={baseClass}>
      {table.map((entry) => {
        const { playerId, cards } = entry;
        const playerEntryKey = `table-${playerId}`;
        return (
          <div key={playerEntryKey} className="d-table__player-entry">
            <div className="d-table__cards">
              {cards.map((cardId) => {
                if (!cardId) {
                  return (
                    <div
                      key={`${playerEntryKey}-placeholder`}
                      className="d-table__card d-table__card-placeholder"
                      style={{ width: 1 }}
                    />
                  );
                }

                return (
                  <ImageCard
                    key={`${playerEntryKey}${cardId}`}
                    imageId={cardId}
                    cardWidth={Math.max(width / 12, 120)}
                    className="d-table__card"
                  />
                );
              })}
            </div>
            <div className="d-table__player-info">
              <Avatar id={players[playerId].avatarId} className="d-table__player-avatar" size="medium" />
              <span
                className="d-table__player-bar"
                style={{ backgroundColor: AVATARS[players[playerId].avatarId].color }}
              />
              <span className="d-table__player-name">{players[playerId].name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

Table.propTypes = {
  players: PropTypes.any,
  table: PropTypes.arrayOf(
    PropTypes.shape({
      playerId: PropTypes.string,
      cards: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};

export default Table;
