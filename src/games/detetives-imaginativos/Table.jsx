import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Spin } from 'antd';
// Hooks
import { useCardWidth } from '../../hooks';
// Utils
import { AVATARS } from '../../utils/constants';
// Components
import { ImageBlurButtonContainer, ImageCard } from '../../components/cards';
import { Avatar } from '../../components/avatars';

export function Table({ table, players }) {
  const cardWidth = useCardWidth(12, 16);
  const baseClass = 'd-table';

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
                  <ImageBlurButtonContainer cardId={cardId} className="d-table__card">
                    <ImageCard key={`${playerEntryKey}${cardId}`} imageId={cardId} cardWidth={cardWidth} />
                  </ImageBlurButtonContainer>
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
