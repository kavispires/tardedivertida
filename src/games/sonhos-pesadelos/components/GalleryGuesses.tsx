// Ant Design Resources
import { Avatar as AntAvatar } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
import type { GalleryEntry } from '../utils/types';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { Avatar } from 'components/avatars';
import { StarPoints } from 'components/points';
import { DreamCard } from './DreamCard';

type GalleryGuessesProps = {
  entry: GalleryEntry;
  players: GamePlayers;
  correctGuessPoints: number;
};

export function GalleryGuesses({ entry, players, correctGuessPoints }: GalleryGuessesProps) {
  const cardWidth = useCardWidth(8, { gap: 20 });
  return (
    <ul className="s-gallery-guesses">
      {entry.cards.map((cardEntry) => {
        return (
          <li
            key={`gallery-guess-${cardEntry.cardId}`}
            className="s-gallery-guesses__votes-container"
            style={{ width: `${cardWidth + 16}px` }}
          >
            <div>
              <DreamCard
                cardId={cardEntry.cardId}
                cardWidth={cardWidth}
                isDream={cardEntry.isDream}
                isNightmare={cardEntry.isNightmare}
                hideBlurButton
              />
            </div>
            <div className="s-gallery-guesses__votes">
              <AntAvatar.Group>
                {cardEntry.votes.map((playerId) => {
                  const player = players[playerId];
                  return <Avatar id={player.avatarId} alt={player.name} size="small" />;
                })}
              </AntAvatar.Group>
              {cardEntry.votes.length > 0 && cardEntry.isDream && (
                <StarPoints quantity={correctGuessPoints} keyPrefix={'dream-correct'} hideText />
              )}

              {cardEntry.votes.length > 0 && cardEntry.isNightmare && (
                <StarPoints quantity={-1} keyPrefix={'dream-incorrect'} hideText />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
