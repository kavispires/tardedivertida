// Utils
import { getMovieTitles } from '../utils/helpers';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { WinningCount } from './WinningCount';

export function ResultVamosAoCinema({ task, winningValues, winningTeam }: ResultComponentProps) {
  const movies: StringDictionary = getMovieTitles(task.data.movies);

  return (
    <>
      <WinningCount>{winningTeam.length}</WinningCount>
      <Instruction>
        <Translate pt="A filme mais votado foi" en="The most popular movie was" />:
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
