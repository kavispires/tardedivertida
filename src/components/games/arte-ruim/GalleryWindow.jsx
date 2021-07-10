import React, { memo } from 'react';

// Hooks
import { useGlobalState } from '../../../hooks';
// Components
import CanvasSVG from './CanvasSVG';
import GalleryWindowCredits from './GalleryWindowCredits';
import GalleryWindowGuesses from './GalleryWindowGuesses';
import GalleryWindowControls from './GalleryWindowControls';
import GalleryWindowResult from './GalleryWindowResult';
import CanvasResizer from './CanvasResizer';

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

export default memo(GalleryWindow);
