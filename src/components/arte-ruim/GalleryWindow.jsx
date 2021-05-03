import React, { memo } from 'react';

// Components
import CanvasSVG from './CanvasSVG';
import GalleryWindowCredits from './GalleryWindowCredits';
import GalleryWindowGuesses from './GalleryWindowGuesses';
import GalleryWindowControls from './GalleryWindowControls';
import GalleryWindowResult from './GalleryWindowResult';

function GalleryWindow({ window, galleryLength, players, activeIndex, setActiveIndex }) {
  const { drawing, artist, correctAnswer, playersPoints, playersSay } = window;

  return (
    <div className="gallery-window">
      <CanvasSVG key={window.correctAnswer} drawing={drawing} className="gallery-window__drawing" />

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
      />
    </div>
  );
}

export default memo(GalleryWindow);
