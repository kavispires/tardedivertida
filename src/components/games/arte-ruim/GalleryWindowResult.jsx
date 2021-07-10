import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Avatar as AntAvatar, Typography } from 'antd';
import { CrownFilled, DeleteFilled } from '@ant-design/icons';
// Utils
import { getPlayersFromIds } from '../../../utils';
// Components
import { Avatar } from '../../avatars';
import { StarPoints } from '../../shared';

function GalleryWindowResult({
  playerArtist,
  correctAnswerId,
  correctAnswerText,
  playersPoints,
  playersSay,
  players,
}) {
  const correctGuesses = Object.values(playersSay?.[correctAnswerId] ?? {});

  return (
    <div className="a-gallery-window__result">
      <div className="a-gallery-window__label">E o nome correto da obra é</div>
      <div className="a-gallery-window__speech-bubble">
        <CrownFilled className="a-gallery-window__speech-bubble-icon" />
        {correctAnswerText}
      </div>
      {correctGuesses.length ? (
        <Fragment>
          <div className="a-gallery-window__players">
            <AntAvatar.Group>
              {correctGuesses.map((playerId) => {
                return <Avatar key={`correct-guess-avatar-${playerId}`} id={players[playerId].avatarId} />;
              })}
            </AntAvatar.Group>
            <StarPoints quantity={2} keyPrefix={`guessers-points-${playerArtist.id}`} />
            <span className="a-gallery-window__players-names">
              {getPlayersFromIds(correctGuesses, players, true).join(', ')}
            </span>
          </div>
          <div className="a-gallery-window__artist-points">
            <Avatar id={playerArtist.avatarId} />{' '}
            <StarPoints
              quantity={playersPoints?.[playerArtist.id]}
              keyPrefix={`artist-points-${playerArtist.id}`}
            />{' '}
            <span className="a-gallery-window__players-names">{playerArtist.name}</span>
          </div>
        </Fragment>
      ) : (
        <Typography.Text className="a-gallery-window__no-wins">
          <DeleteFilled /> Nossa, ninguém acertou. Esse desenho deve ter sido muito ruim.
        </Typography.Text>
      )}
    </div>
  );
}

GalleryWindowResult.propTypes = {
  playerArtist: PropTypes.object,
  correctAnswer: PropTypes.string,
  playersPoints: PropTypes.object,
  playersSay: PropTypes.object,
  players: PropTypes.object,
};

export default memo(GalleryWindowResult);
