// Components
import { PlayerAvatar, PlayerAvatarCard } from 'components/avatars';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteWhoSaidThis({ track, playersList, players }: VoteComponentProps) {
  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => (
        <div key={`vote-${player.id}`} className="player-vote">
          <PlayerAvatar avatarId={player.avatarId} />
          <div className="player-vote__name">{player.name}</div>

          <div className="player-vote__value">
            <PlayerAvatarCard player={players[player.data.value]} withName size="small" />
          </div>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
