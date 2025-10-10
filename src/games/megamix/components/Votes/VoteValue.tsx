// Ant Design Resources
import { Tooltip } from 'antd';
// Components
import { PlayerAvatar } from 'components/avatars';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteValue({ playersList }: VoteComponentProps) {
  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => (
        <div key={`vote-${player.id}`} className="player-vote">
          <PlayerAvatar avatarId={player.avatarId} />
          <div className="player-vote__name">{player.name}</div>
          <Tooltip title={player.data.value}>
            <div className="player-vote__value">{player.data.value}</div>
          </Tooltip>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
