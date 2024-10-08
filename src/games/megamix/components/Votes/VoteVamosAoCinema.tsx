// Components
import { Avatar } from 'components/avatars';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { getMovieTitles } from '../../utils/helpers';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';

export function VoteVamosAoCinema({ track, playersList }: VoteComponentProps) {
  const movies: StringDictionary = getMovieTitles(track.data.movies);

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
