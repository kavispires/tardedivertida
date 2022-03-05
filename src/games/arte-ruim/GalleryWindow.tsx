// Hooks
import { useCardWidth } from 'hooks';
// Constants
import { AVATARS } from 'utils/constants';
// Components
import { CanvasSVG } from 'components';
import { GalleryWindowCredits } from './GalleryWindowCredits';
import { GalleryWindowGuesses } from './GalleryWindowGuesses';
import { GalleryWindowControls } from './GalleryWindowControls';
import { GalleryWindowResult } from './GalleryWindowResult';

type GalleryWindowProps = {
  window: ArteRuimWindow;
  galleryLength: number;
  players: GamePlayers;
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: GenericFunction;
  cards: ArteRuimCard[];
  disableControls: boolean;
};

export function GalleryWindow({
  window,
  galleryLength,
  players,
  activeIndex,
  setActiveIndex,
  setStep,
  cards,
  disableControls,
}: GalleryWindowProps) {
  const canvasWidth = useCardWidth(2, 16, 200, 500);

  const { drawing, artistId, id, text, playersPoints, playersSay } = window;

  const playerArtist = players[artistId];
  const currentColor = AVATARS[playerArtist.avatarId].color;

  return (
    <div className="a-gallery-window">
      <div className="a-gallery-window__drawing-container">
        <CanvasSVG drawing={drawing} size={canvasWidth} className="a-gallery-window__drawing" />
      </div>

      <GalleryWindowCredits artistName={playerArtist.name} artistAvatarId={playerArtist.avatarId} />

      <GalleryWindowGuesses
        players={players}
        playersSay={playersSay}
        cards={cards}
        windowCardId={window.id}
        artistColor={currentColor}
      />

      <GalleryWindowResult
        playerArtist={playerArtist}
        correctAnswerId={id}
        correctAnswerText={text}
        playersPoints={playersPoints}
        playersSay={playersSay}
        players={players}
      />

      <GalleryWindowControls
        galleryLength={galleryLength}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        setStep={setStep}
        disableControls={disableControls}
        barColor={currentColor}
      />
    </div>
  );
}
