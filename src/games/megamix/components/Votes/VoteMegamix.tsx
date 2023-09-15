// Components
import { Avatar } from 'components/avatars';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteMegamix({ track, playersList }: VoteComponentProps) {
  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => (
        <div key={`vote-${player.id}`} className="player-vote">
          <Avatar id={player.avatarId} />
          <div className="player-vote__name">{player.name}</div>
          <div className="player-vote__value">{track.data.card.options[Number(player.data.value)]}</div>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
