import clsx from 'clsx';

import { PalavreadoLetter } from '../utils/type';

type BoardProps = {
  letters: PalavreadoLetter[];
  selection: number[];
  onLetterSelection: (index: number) => void;
};

export function Board({ letters, onLetterSelection, selection }: BoardProps) {
  return (
    <div className="palavreado-board">
      {letters.map(({ letter, index, locked, state }) => (
        <button
          key={`${letter}-${index}`}
          className={clsx(
            'palavreado-board__tile',
            !locked && !selection.includes(index) && 'palavreado-board__tile--button',
            selection.includes(index) && 'palavreado-board__tile--selected',
            `palavreado-board__tile--${state}`
          )}
          onClick={() => (!locked ? onLetterSelection(index) : null)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
