// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { Translate } from 'components/language';
import { StarPoints } from 'components/points';
import {
  SlideShowBubbleValue,
  SlideShowLabel,
  SlideShowNoWins,
  SlideShowPlayersList,
} from 'components/slide-show';
// Internal
import type { PlayersSay } from '../utils/types';

type GalleryWindowResultProps = {
  playerArtist: GamePlayer;
  correctAnswerId: string;
  correctAnswerText: string;
  playersPoints?: NumberDictionary;
  playersSay: PlayersSay;
  players: GamePlayers;
};

export function GalleryWindowResult({
  playerArtist,
  correctAnswerId,
  correctAnswerText,
  playersPoints,
  playersSay,
  players,
}: GalleryWindowResultProps) {
  const correctGuesses = Object.values(playersSay?.[correctAnswerId] ?? {});

  return (
    <div className="a-gallery__result">
      <SlideShowLabel>
        <Translate pt="E o título correto da obra é" en="And the masterpiece title is" />
      </SlideShowLabel>
      <SlideShowBubbleValue winner>{correctAnswerText}</SlideShowBubbleValue>
      {correctGuesses.length ? (
        <>
          <SlideShowPlayersList players={players} playersIds={correctGuesses}>
            <StarPoints quantity={2} keyPrefix={`guessers-points-${playerArtist.id}`} />
          </SlideShowPlayersList>

          <SlideShowPlayersList players={players} playersIds={[playerArtist.id]}>
            <StarPoints
              quantity={playersPoints?.[playerArtist.id]}
              keyPrefix={`artist-points-${playerArtist.id}`}
            />
          </SlideShowPlayersList>
        </>
      ) : (
        <SlideShowNoWins>
          <Translate
            pt="Esse desenho deve ter sido muito ruim."
            en="It must have been a very crappy drawing. Shame..."
          />
        </SlideShowNoWins>
      )}
    </div>
  );
}
