import PropTypes from 'prop-types';
import React, { memo } from 'react';
// Hooks
import { useGlobalState } from '../../../hooks';
// Components
import { CanvasSVG, CanvasResizer } from '../../canvas';
import GalleryWindowCredits from './GalleryWindowCredits';
import GalleryWindowGuesses from './GalleryWindowGuesses';
import GalleryWindowControls from './GalleryWindowControls';
import GalleryWindowResult from './GalleryWindowResult';

function GalleryWindow({ window, galleryLength, players, activeIndex, setActiveIndex, setStep, cards }) {
  const [canvasSize] = useGlobalState('canvasSize');

  const { drawing, artist, id, text, level, playersPoints, playersSay } = window;

  const playerArtist = players[artist];

  return (
    <div className="a-gallery-window">
      <CanvasResizer numPlayers={Object.keys(players).length} />
      <div className="a-gallery-window__drawing-container">
        <CanvasSVG
          key={window.correctAnswer}
          drawing={drawing}
          size={canvasSize}
          className="a-gallery-window__drawing"
        />
      </div>

      <GalleryWindowCredits artistName={playerArtist.name} artistAvatarId={playerArtist.avatarId} />

      <GalleryWindowGuesses players={players} playersSay={playersSay} cards={cards} />

      <GalleryWindowResult
        playerArtist={playerArtist}
        correctAnswerId={id}
        correctAnswerText={text}
        correctAnswerLevel={level}
        playersPoints={playersPoints}
        playersSay={playersSay}
        players={players}
      />

      <GalleryWindowControls
        galleryLength={galleryLength}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        setStep={setStep}
      />
    </div>
  );
}

GalleryWindow.propTypes = {
  activeIndex: PropTypes.number,
  cards: PropTypes.array,
  galleryLength: PropTypes.number,
  players: PropTypes.object,
  setActiveIndex: PropTypes.func,
  setStep: PropTypes.func,
  window: PropTypes.shape({
    artist: PropTypes.string,
    correctAnswer: PropTypes.string,
    drawing: PropTypes.string,
    id: PropTypes.string,
    level: PropTypes.number,
    playersPoints: PropTypes.object,
    playersSay: PropTypes.object,
    text: PropTypes.string,
  }),
};

export default memo(GalleryWindow);
