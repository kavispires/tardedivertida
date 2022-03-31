import { Avatar } from 'components';
import { Avatar as AntAvatar } from 'antd';
import { useCardWidth } from 'hooks';
import { DreamCard } from './DreamCard';

type GalleryGuessesProps = {
  entry: SGalleryEntry;
  players: GamePlayers;
};

export function GalleryGuesses({ entry, players }: GalleryGuessesProps) {
  const cardWidth = useCardWidth(8, 20);
  return (
    <ul className="s-gallery-guesses">
      {entry.cards.map((cardEntry) => {
        return (
          <li className="s-gallery-guesses__votes-container" style={{ width: `${cardWidth + 16}px` }}>
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
            </div>
          </li>
        );
      })}
    </ul>
  );
}
