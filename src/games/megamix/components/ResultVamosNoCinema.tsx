import { Translate } from 'components/language';
import { Instruction } from 'components/text';

import { getMovieTitles } from '../utils/helpers';
import { WinningCount } from './WinningCount';

export function ResultVamosAoCinema({ task, winningValues, winningTeam }: ResultComponentProps) {
  const movies: StringDictionary = getMovieTitles(task.data.movies);

  return (
    <>
      <WinningCount>{winningTeam.length}</WinningCount>
      <Instruction>
        <Translate pt="A arte mais votada foi" en="The most popular art was" />:
      </Instruction>
      <div className="task-result-values__cards">
        {winningValues.map((value) => {
          return (
            <div key={`winning-${value}`} className="task-result-values__text-value">
              {movies[value]}
            </div>
          );
        })}
      </div>
    </>
  );
}
