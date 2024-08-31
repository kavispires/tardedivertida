// Types
import type { VoteComponentProps } from '../../utils/types';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { Avatar } from 'components/avatars';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { CrimesHediondosCard } from 'types/tdr';
import { CrimeItemCard } from 'components/cards/CrimeItemCard';

export function VoteCrimesHediondos({ playersList, track }: VoteComponentProps) {
  const width = useCardWidth(playersList.length + 4, {
    gap: 8,
    minWidth: 50,
    maxWidth: 120,
    margin: 8,
  });

  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => {
        const item = track.data.cards.find((card: CrimesHediondosCard) => card.id === player.data.value);

        if (!item) {
          return null;
        }

        return (
          <div key={`vote-${player.id}`} className="player-vote">
            <Avatar id={player.avatarId} />
            <div className="player-vote__name">{player.name}</div>

            <CrimeItemCard item={item} cardWidth={width} className="d-table__image-card" />
          </div>
        );
      })}
    </SpacePlayerCheckWrapper>
  );
}
