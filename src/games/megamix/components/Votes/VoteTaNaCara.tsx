// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
// Components
import { Avatar } from 'components/avatars';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteTaNaCara({ playersList }: VoteComponentProps) {
  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => (
        <div key={`vote-${player.id}`} className="player-vote">
          <Avatar id={player.avatarId} />
          <div className="player-vote__name">{player.name}</div>

          <div className="player-vote__value">
            {player.data.value === 'yes' ? <SpeechBubbleAcceptedIcon /> : <SpeechBubbleDeclinedIcon />}
          </div>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
