// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { ResultComponentProps } from '../../utils/types';
import { getMovieTitles } from '../../utils/helpers';

export function ResultVamosAoCinema({
  track,
  winningValues,
  winningTeam,
  playersList,
}: ResultComponentProps) {
  const movies: Dictionary<string> = getMovieTitles(track.data.movies);

  return (
    <>
      <Surface>
        <Translate
          pt="A filme mais votado foi"
          en="The most popular movie was"
        />
        :
      </Surface>
      <div className="track-result-values__cards">
        {winningValues.map((value) => {
          return (
            <div
              key={`winning-${value}`}
              className="track-result-values__text-value"
            >
              {movies[value]}
            </div>
          );
        })}
      </div>
    </>
  );
}
