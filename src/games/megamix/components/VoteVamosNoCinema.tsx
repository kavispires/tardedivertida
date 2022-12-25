import { Avatar } from 'components/avatars';

import { getMovieTitles } from '../utils/helpers';
import { SpacePlayerCheckWrapper } from './SpacePlayerCheckWrapper';

export function VoteVamosNoCinema({ task, players, playersList }: VoteComponentProps) {
  const movies: StringDictionary = getMovieTitles(task.data.movies);

  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => {
        return (
          <div key={`vote-${player.id}`} className="player-vote">
            <Avatar id={player.avatarId} />
            <div>{player.name}</div>
            <div className="player-vote__value">{movies[player.data.value]}</div>
          </div>
        );
      })}
    </SpacePlayerCheckWrapper>
  );
}
