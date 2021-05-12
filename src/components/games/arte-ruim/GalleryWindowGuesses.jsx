import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Avatar as AntAvatar } from 'antd';
import { MessageFilled } from '@ant-design/icons';
// Components
import Avatar from '../../avatars/Avatar';

function GalleryWindowGuesses({ playersSay, players, cards }) {
  return (
    <div className="a-gallery-window__guesses">
      <div className="a-gallery-window__label">Participantes votaram</div>
      {Object.entries(playersSay).map(([cardId, playersNames], index) => {
        const card = cards.find((i) => i.id === cardId);
        return (
          <div key={`guess-${cardId}-${index}`} className="a-gallery-window__guess">
            <div className="a-gallery-window__speech-bubble">
              <MessageFilled className="a-gallery-window__speech-bubble-icon" /> {card.text}
            </div>
            <div className="a-gallery-window__players">
              <AntAvatar.Group>
                {playersNames.map((playerName) => (
                  <Avatar
                    id={players[playerName].avatarId}
                    key={`guess-avatar-${players[playerName].avatarId}`}
                  />
                ))}
              </AntAvatar.Group>
              <span className="a-gallery-window__players-names">{playersNames.join(', ')}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

GalleryWindowGuesses.propTypes = {
  playersSay: PropTypes.object,
  players: PropTypes.object,
};

export default memo(GalleryWindowGuesses);
