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

function GalleryWindow({ window, galleryLength, players, activeIndex, setActiveIndex, setStep }) {
  const [canvasSize] = useGlobalState('canvasSize');

  const { drawing, artist, correctAnswer, playersPoints, playersSay } = window;

  return (
    <div className="a-gallery-window">
      <CanvasResizer />
      <div className="a-gallery-window__drawing-container">
        <CanvasSVG
          key={window.correctAnswer}
          drawing={drawing}
          size={canvasSize}
          className="a-gallery-window__drawing"
        />
      </div>

      <GalleryWindowCredits artist={artist} artistAvatarId={players[artist].avatarId} />

      <GalleryWindowGuesses players={players} playersSay={playersSay} />

      <GalleryWindowResult
        artist={artist}
        correctAnswer={correctAnswer}
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
