// Types
import type { VoteComponentProps } from '../../utils/types';
// Ant Design Resources
import { Avatar as AntAvatar } from 'antd';
// Components
import { Avatar } from 'components/avatars';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { LETTERS } from 'utils/constants';

export function VoteLabirintoSecreto({ playersList }: VoteComponentProps) {
  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => (
        <div key={`vote-${player.id}`} className="player-vote">
          <Avatar id={player.avatarId} />
          <div className="player-vote__name">{player.name}</div>

          <div className="player-vote__value">
            <AntAvatar>{LETTERS[Number(player.data.value)]}</AntAvatar>
          </div>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
