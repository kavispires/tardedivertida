import { orderBy } from 'lodash';
// Types
import type { GamePlayers } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import {
  SlideShowBubbleValue,
  SlideShowLabel,
  SlideShowPlayersList,
} from '@components/slide-show/SlideShowComposableComponents';
// Internal
import type { ArteRuimCustomCard, PlayersSay } from '../utils/types';

type GalleryWindowGuessesProps = {
  playersSay: PlayersSay;
  players: GamePlayers;
  cards: ArteRuimCustomCard[];
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
        <Translate
          pt="Participantes votaram"
          en="Players voted"
        />
      </SlideShowLabel>

      {entries.map((entry, index) => {
        return (
          <div
            key={`guess-${entry.cardId}-${index}`}
            className="a-gallery__guess"
          >
            <SlideShowBubbleValue
              winner={entry.isCorrect}
              backgroundColor={artistColor}
            >
              {entry.card?.text}
            </SlideShowBubbleValue>

            <SlideShowPlayersList
              players={players}
              playersIds={entry.playersIds}
            />
          </div>
        );
      })}
    </div>
  );
}
