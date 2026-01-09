// Components
import { PlayerAvatar } from 'components/avatars';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteQuemNaoMata({ players, playersList }: VoteComponentProps) {
  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      {playersList.map((player) => (
        <div
          key={`vote-${player.id}`}
          className="player-vote"
        >
          <PlayerAvatar avatarId={player.avatarId} />
          <div className="player-vote__name">{player.name}</div>
          <div className="player-vote__value">{players[player.data?.value]?.name}</div>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
