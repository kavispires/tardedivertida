// Ant Design Resources
import { Tooltip } from 'antd';
// Components
import { Avatar } from 'components/avatars';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteMegamix({ track, playersList }: VoteComponentProps) {
  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => (
        <div key={`vote-${player.id}`} className="player-vote">
          <Avatar id={player.avatarId} />
          <div className="player-vote__name">{player.name}</div>
          <Tooltip title={track.data.card.options[Number(player.data.value)]}>
            <div className="player-vote__value">{track.data.card.options[Number(player.data.value)]}</div>
          </Tooltip>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
