import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Avatar as AntAvatar, Typography } from 'antd';
import { CrownFilled, DeleteFilled } from '@ant-design/icons';
// Resources
// import allCards from '../../../resources/arte-ruim-cards.json';
// Components
import Avatar from '../../avatars/Avatar';
import StarPoints from '../../shared/StarPoints';

const allCards = {};

function GalleryWindowResult({ artist, correctAnswer, playersPoints, playersSay, players }) {
  const correctGuesses = Object.values(playersSay?.[correctAnswer] ?? {});

  return (
    <div className="a-gallery-window__result">
      <div className="a-gallery-window__label">E a carta correta é</div>
      <div className="a-gallery-window__speech-bubble">
        <CrownFilled className="a-gallery-window__speech-bubble-icon" />
        {allCards[correctAnswer].text}
      </div>
      {correctGuesses.length ? (
        <Fragment>
          <div className="a-gallery-window__players">
            <AntAvatar.Group>
              {correctGuesses.map((playerName) => {
                return (
                  <Avatar key={`correct-guess-avatar-${playerName}`} id={players[playerName].avatarId} />
                );
              })}
            </AntAvatar.Group>
            <StarPoints quantity={2} keyPrefix={`guessers-points-${artist}`} />
            <span className="a-gallery-window__players-names">{correctGuesses.join(', ')}</span>
          </div>
          <div className="a-gallery-window__artist-points">
            <Avatar id={players[artist].avatarId} />{' '}
            <StarPoints quantity={playersPoints?.[artist]} keyPrefix={`artist-points-${artist}`} />{' '}
            <span className="a-gallery-window__players-names">{artist}</span>
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
  artist: PropTypes.string,
  correctAnswer: PropTypes.string,
  playersPoints: PropTypes.object,
  playersSay: PropTypes.object,
  players: PropTypes.object,
};

export default memo(GalleryWindowResult);
