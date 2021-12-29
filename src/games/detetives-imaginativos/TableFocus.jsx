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

export function TableFocus({ table, currentPlayer }) {
  const cardWidth = useCardWidth(6, 32, 250);

  const tableEntry = table.find((entry) => entry.playerId === currentPlayer.id);
  const baseClass = 'd-table';

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
              <ImageBlurButtonContainer cardId={cardId} className="d-table__card">
                <ImageCard key={`table-focus-${cardId}`} imageId={cardId} cardWidth={cardWidth} />
              </ImageBlurButtonContainer>
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
