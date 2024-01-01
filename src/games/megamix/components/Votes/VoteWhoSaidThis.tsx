// Types
import type { VoteComponentProps } from '../../utils/types';
// Components
import { Avatar, AvatarCard } from 'components/avatars';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteWhoSaidThis({ track, playersList, players }: VoteComponentProps) {
  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => (
        <div key={`vote-${player.id}`} className="player-vote">
          <Avatar id={player.avatarId} />
          <div className="player-vote__name">{player.name}</div>

          <div className="player-vote__value">
            <AvatarCard player={players[player.data.value]} withName size="small" />
          </div>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
