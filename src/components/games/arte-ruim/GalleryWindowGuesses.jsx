import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Avatar as AntAvatar } from 'antd';
import { MessageFilled } from '@ant-design/icons';
// Utils
import { getPlayersFromIds } from '../../../utils';
// Components
import { Avatar } from '../../avatars';

function GalleryWindowGuesses({ playersSay, players, cards }) {
  return (
    <div className="a-gallery-window__guesses">
      <div className="a-gallery-window__label">Participantes votaram</div>
      {Object.entries(playersSay).map(([cardId, playerIds], index) => {
        const card = cards.find((i) => i.id === cardId);
        return (
          <div key={`guess-${cardId}-${index}`} className="a-gallery-window__guess">
            <div className="a-gallery-window__speech-bubble">
              <MessageFilled className="a-gallery-window__speech-bubble-icon" /> {card.text}
            </div>
            <div className="a-gallery-window__players">
              <AntAvatar.Group>
                {playerIds.map((playerId) => (
                  <Avatar
                    id={players[playerId].avatarId}
                    key={`guess-avatar-${players[playerId].avatarId}`}
                  />
                ))}
              </AntAvatar.Group>
              <span className="a-gallery-window__players-names">
                {getPlayersFromIds(playerIds, players, true).join(', ')}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

GalleryWindowGuesses.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
    })
  ),
  players: PropTypes.object,
  playersSay: PropTypes.object,
};

export default memo(GalleryWindowGuesses);
