import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Avatar as AntAvatar } from 'antd';
import { MessageFilled } from '@ant-design/icons';
// Resources
import allCards from '../../resources/arte-ruim-cards.json';
// Components
import Avatar from '../avatars/Avatar';

function GalleryWindowGuesses({ playersSay, players }) {
  return (
    <div className="gallery-window__guesses">
      <div className="gallery-window__label">Participantes votaram</div>
      {Object.entries(playersSay).map(([cardId, playersNames], index) => {
        return (
          <div key={`guess-${cardId}-${index}`} className="gallery-window__guess">
            <div className="gallery-window__speech-bubble">
              <MessageFilled className="gallery-window__speech-bubble-icon" /> {allCards[cardId]?.text}
            </div>
            <div className="gallery-window__players">
              <AntAvatar.Group>
                {playersNames.map((playerName) => (
                  <Avatar
                    id={players[playerName].avatarId}
                    key={`guess-avatar-${players[playerName].avatarId}`}
                  />
                ))}
              </AntAvatar.Group>
              <span className="gallery-window__players-names">{playersNames.join(', ')}</span>
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
