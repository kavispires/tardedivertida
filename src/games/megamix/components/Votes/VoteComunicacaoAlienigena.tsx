// Components
import { Avatar } from 'components/avatars';
import { ItemCard } from 'components/cards/ItemCard';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteComunicacaoAlienigena({ playersList }: VoteComponentProps) {
  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => (
        <div key={`vote-${player.id}`} className="player-vote">
          <Avatar id={player.avatarId} />
          <div className="player-vote__name">{player.name}</div>
          <ItemCard id={String(player.data.value)} width={80} className="d-table__image-card" />
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
