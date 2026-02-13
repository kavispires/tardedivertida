import { groupBy } from 'lodash';
import { useMemo } from 'react';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { getMovieTitles } from '../../utils/helpers';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Voters } from '../Voters';

export function VoteVamosAoCinema({ track, playersList }: VoteComponentProps) {
  const movies: StringDictionary = getMovieTitles(track.data.movies);

  const groupedVotes = useMemo(() => {
    return groupBy(playersList, (player) => player.data.value);
  }, [playersList]);

  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      <div className="vote-groups">
        {Object.entries(groupedVotes).map(([movieId, voters]) => (
          <div
            key={`vote-group-${movieId}`}
            className="vote-groups__group"
          >
            <div className="vote-groups__target">
              <div className="player-vote__value">{movies[movieId]}</div>
            </div>

            <Voters voters={voters} />
          </div>
        ))}
      </div>
    </SpacePlayerCheckWrapper>
  );
}
