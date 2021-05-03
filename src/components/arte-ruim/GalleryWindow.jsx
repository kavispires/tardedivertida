import React, { Fragment, memo, useEffect } from 'react';
import clsx from 'clsx';
// Design Resources
import { Avatar as AntAvatar, Button, Typography } from 'antd';
import {
  CrownFilled,
  DeleteFilled,
  MessageFilled,
  PauseOutlined,
  PlayCircleOutlined,
  StarFilled,
  StepBackwardOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
// Resources
import allCards from '../../resources/arte-ruim-cards.json';
// Components
import CanvasSVG from './CanvasSVG';

import AvatarEntry from '../avatars/AvatarEntry';
import Avatar from '../avatars/Avatar';
import { inNSeconds } from '../../utils';
import { useTimer } from 'react-timer-hook';

function GalleryWindows({ window, galleryLength, players, activeIndex, setActiveIndex }) {
  const { drawing, artist, correctAnswer, playersPoints, playersSay } = window;
  const correctGuesses = Object.values(playersSay?.[correctAnswer] ?? {});

  const { seconds, isRunning, pause, resume } = useTimer({
    expiryTimestamp: inNSeconds(10 * galleryLength),
    autoStart: true,
  });

  // Automatically go to the next window every 10 seconds
  useEffect(() => {
    if (seconds < 10 * galleryLength && seconds > 0 && seconds % 10 === 0) {
      setActiveIndex((s) => Math.min(s + 1, galleryLength - 1));
    }
  }, [seconds, setActiveIndex, galleryLength]);

  const previousStep = () => {
    setActiveIndex((s) => Math.max(s - 1, 0));
  };

  const nextStep = () => {
    setActiveIndex((s) => Math.min(s + 1, galleryLength - 1));
  };

  return (
    <div className="gallery-window">
      <CanvasSVG key={window.correctAnswer} drawing={drawing} className="gallery-window__drawing" />
      <div className="gallery-window__credits">
        <div className="gallery-window__label">Artista</div>
        <span className="gallery-window__artist-name">
          <AvatarEntry id={players[artist].avatarId} name={artist} />
        </span>
      </div>
      <div className="gallery-window__guesses">
        <div className="gallery-window__label">Participantes votaram</div>
        {Object.entries(playersSay).map(([cardId, playersNames], index) => {
          return (
            <div key={`${cardId}-${index}`} className="gallery-window__guess">
              <div className="gallery-window__speech-bubble">
                <MessageFilled className="gallery-window__speech-bubble-icon" /> {allCards[cardId]?.text}
              </div>
              <div className="gallery-window__players">
                <AntAvatar.Group>
                  {playersNames.map((playerName) => (
                    <Avatar id={players[playerName].avatarId} />
                  ))}
                </AntAvatar.Group>
                <span className="gallery-window__players-names">{playersNames.join(', ')}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="gallery-window__result">
        <div className="gallery-window__label">E a carta correta é</div>
        <div className="gallery-window__speech-bubble">
          <CrownFilled className="gallery-window__speech-bubble-icon" />
          {allCards[correctAnswer].text}
        </div>
        {correctGuesses.length ? (
          <Fragment>
            <div className="gallery-window__players">
              <AntAvatar.Group>
                {correctGuesses.map((playerName) => {
                  return <Avatar id={players[playerName].avatarId} />;
                })}
              </AntAvatar.Group>
              <StarPoints quantity={2} />
            </div>
            <div className="gallery-window__artist-points">
              <Avatar id={players[artist].avatarId} /> <StarPoints quantity={playersPoints?.[artist]} />
            </div>
          </Fragment>
        ) : (
          <Typography.Text className="gallery-window__no-wins">
            <DeleteFilled /> Nossa, ninguém acertou. Seu desenho deve ter sido muito ruim.
          </Typography.Text>
        )}
      </div>
      <div className="gallery-window__controls">
        <div className="gallery-window__timer-bar">
          <span style={{ width: `${Math.abs((10 * seconds) / galleryLength - 100)}%` }}></span>
        </div>
        <Button
          size="large"
          shape="circle"
          icon={<StepBackwardOutlined />}
          onClick={previousStep}
          disabled={activeIndex === 0}
        />
        <Button
          size="large"
          shape="circle"
          icon={isRunning ? <PauseOutlined /> : <PlayCircleOutlined />}
          onClick={isRunning ? pause : resume}
        />
        <Button
          size="large"
          shape="circle"
          icon={<StepForwardOutlined />}
          onClick={nextStep}
          disabled={activeIndex === galleryLength - 1}
        />
      </div>
    </div>
  );
}

function StarPoints({ quantity, className }) {
  if (!quantity || quantity < 1) {
    return <span></span>;
  }
  const starArrays = new Array(quantity).fill(<StarFilled />);
  return (
    <span className={clsx('star-points', className)}>
      + <span className="star-points__stars">{starArrays}</span> point{quantity > 1 ? 's' : ''}
    </span>
  );
}

export default memo(GalleryWindows);
