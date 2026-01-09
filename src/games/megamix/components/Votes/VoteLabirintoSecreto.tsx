// Ant Design Resources
import { Avatar } from 'antd';
// Utils
import { LETTERS } from 'utils/constants';
// Components
import { PlayerAvatar } from 'components/avatars';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteLabirintoSecreto({ playersList }: VoteComponentProps) {
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

          <div className="player-vote__value">
            <Avatar>{LETTERS[Number(player.data.value)]}</Avatar>
          </div>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
