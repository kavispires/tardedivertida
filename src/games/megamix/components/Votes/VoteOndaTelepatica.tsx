import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteOndaTelepatica({ playersList }: VoteComponentProps) {
  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => (
        <div key={`vote-${player.id}`} className="player-vote">
          <Avatar id={player.avatarId} />
          <div className="player-vote__name">{player.name}</div>
          <div className="player-vote__value">
            {player.data?.value === 'center' && <Translate pt="Centro" en="Center" />}
            {player.data?.value === 'left' && <Translate pt="Esquerda" en="Left" />}
            {player.data?.value === 'right' && <Translate pt="Direita" en="Right" />}
          </div>
        </div>
      ))}
    </SpacePlayerCheckWrapper>
  );
}
