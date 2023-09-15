// Components
import { Avatar } from 'components/avatars';
import { SplatterSVG } from '../Tracks/TrackPalhetaDeFores';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VotePalhetaDeCores({ playersList }: VoteComponentProps) {
  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => (
        <div key={`vote-${player.id}`} className="player-vote">
          <Avatar id={player.avatarId} />
          <div className="player-vote__name">{player.name}</div>
          <SplatterSVG color={player.data.value} style={{ color: player.data.value }} width={48} />
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
