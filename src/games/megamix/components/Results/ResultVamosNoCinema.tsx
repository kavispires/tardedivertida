// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import type { ResultComponentProps } from '../../utils/types';
import { getMovieTitles } from '../../utils/helpers';

export function ResultVamosAoCinema({
  track,
  winningValues,
  winningTeam,
  playersList,
}: ResultComponentProps) {
  const movies: StringDictionary = getMovieTitles(track.data.movies);

  return (
    <>
      <Instruction>
        <Translate pt="A filme mais votado foi" en="The most popular movie was" />:
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((value) => {
          return (
            <div key={`winning-${value}`} className="track-result-values__text-value">
              {movies[value]}
            </div>
          );
        })}
      </div>
    </>
  );
}
