import { orderBy } from 'lodash';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { Translate } from 'components/language';
import { SlideShowBubbleValue, SlideShowLabel, SlideShowPlayersList } from 'components/slide-show';
// Internal
import type { ArteRuimCard } from '../utils/types';
import type { PlayersSay } from '../utils/types';
// Ant Design Resources
// Utils

type GalleryWindowGuessesProps = {
  playersSay: PlayersSay;
  players: GamePlayers;
  cards: ArteRuimCard[];
  windowCardId: string;
  artistColor: string;
};

export function GalleryWindowGuesses({
  playersSay,
  players,
  cards,
  windowCardId,
  artistColor,
}: GalleryWindowGuessesProps) {
  const entries = orderBy(
    Object.entries(playersSay).map(([cardId, playersIds]) => {
      return {
        cardId,
        card: cards.find((i) => i.id === cardId),
        playersIds,
        count: playersIds.length,
        isCorrect: windowCardId === cardId,
      };
    }),
    ['isCorrect', 'count', 'card.text'],
    ['desc', 'desc', 'asc'],
  );

  return (
    <div className="a-gallery__guesses">
      <SlideShowLabel>
        <Translate pt="Participantes votaram" en="Players voted" />
      </SlideShowLabel>

      {entries.map((entry, index) => {
        return (
          <div key={`guess-${entry.cardId}-${index}`} className="a-gallery__guess">
            <SlideShowBubbleValue winner={entry.isCorrect} backgroundColor={artistColor}>
              {entry.card?.text}
            </SlideShowBubbleValue>

            <SlideShowPlayersList players={players} playersIds={entry.playersIds} />
          </div>
        );
      })}
    </div>
  );
}
