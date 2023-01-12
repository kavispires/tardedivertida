// Utils
import { LETTERS } from 'utils/constants';
// Components
import { Avatar } from 'components/avatars';
import { HouseCard } from 'games/na-rua-do-medo/components/HouseCard';
import { SpacePlayerCheckWrapper } from './SpacePlayerCheckWrapper';

export function VoteNaRuaDoMedo({ task, players, playersList }: VoteComponentProps) {
  if (task.variant === 'house') {
    return (
      <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
        {playersList.map((player) => {
          const house = task.data.options.find((entry: PlainObject) => entry.id === player.data.value);
          return (
            <div key={`vote-${player.id}`} className="player-vote">
              <Avatar id={player.avatarId} />
              <div>{player.name}</div>
              <HouseCard card={house} candyLeftover={0} preview={false} />
            </div>
          );
        })}
      </SpacePlayerCheckWrapper>
    );
  }

  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => {
        return (
          <div key={`vote-${player.id}`} className="player-vote">
            <Avatar id={player.avatarId} />
            <div className="player-vote__name">{player.name}</div>
            <div className="player-vote__value">{LETTERS[player.data.value]}</div>
          </div>
        );
      })}
    </SpacePlayerCheckWrapper>
  );
}
