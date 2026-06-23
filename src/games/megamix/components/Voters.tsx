// Types
import type { GamePlayer } from 'types/game';
// Components
import { PlayerAvatar } from '@components/player/PlayerAvatar';

type VotersProps = {
  voters: GamePlayer[];
};

export function Voters({ voters }: VotersProps) {
  return (
    <div className="vote-groups__voters">
      {voters.map((voter) => (
        <div
          key={`voter-${voter.id}`}
          className="vote-groups__voter"
        >
          <PlayerAvatar
            avatarId={voter.avatarId}
            size="small"
          />
          <div className="vote-groups__voter-name">{voter.name}</div>
        </div>
      ))}
    </div>
  );
}
