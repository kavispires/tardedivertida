// Hooks
import { useCardWidth } from '../../hooks';
// Components
import { CanvasSVG } from '../../components/canvas';
import GalleryWindowCredits from './GalleryWindowCredits';
import GalleryWindowGuesses from './GalleryWindowGuesses';
import GalleryWindowControls from './GalleryWindowControls';
import GalleryWindowResult from './GalleryWindowResult';

type GalleryWindowProps = {
  window: ArteRuimWindow;
  galleryLength: number;
  players: GamePlayers;
  activeIndex: number;
  setActiveIndex: GenericFunction;
  setStep: GenericFunction;
  cards: ArteRuimCard[];
};

function GalleryWindow({
  window,
  galleryLength,
  players,
  activeIndex,
  setActiveIndex,
  setStep,
  cards,
}: GalleryWindowProps) {
  const canvasWidth = useCardWidth(2, 16, 200, 500);

  const { drawing, artistId, id, text, playersPoints, playersSay } = window;

  const playerArtist = players[artistId];

  return (
    <div className="a-gallery-window">
      <div className="a-gallery-window__drawing-container">
        <CanvasSVG
          key={window.correctAnswer}
          drawing={drawing}
          size={canvasWidth}
          className="a-gallery-window__drawing"
        />
      </div>

      <GalleryWindowCredits artistName={playerArtist.name} artistAvatarId={playerArtist.avatarId} />

      <GalleryWindowGuesses players={players} playersSay={playersSay} cards={cards} />

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
      />
    </div>
  );
}

export default GalleryWindow;
