import clsx from 'clsx';

import { PalavreadoLetter } from '../utils/types';
import { getAnimationClass } from 'utils/helpers';

type BoardProps = {
  letters: PalavreadoLetter[];
  selection: number | null;
  swap: number[];
  onLetterSelection: (index: number) => void;
  guesses: string[][];
};

export function Board({ letters, onLetterSelection, selection, swap, guesses }: BoardProps) {
  return (
    <div className="palavreado-board">
      {letters.map(({ letter, locked, state }, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const previousWrongPlacement = guesses.some((attempts) => attempts[row][col] === letter) && !locked;

        return (
          <button
            key={`${letter}-${index}`}
            className={clsx(
              'palavreado-board__tile',
              swap.includes(index) && getAnimationClass('zoomIn', { speed: 'faster' }),
              !locked && selection !== index && 'palavreado-board__tile--button',
              selection === index && 'palavreado-board__tile--selected',
              `palavreado-board__tile--${state}`,

              previousWrongPlacement && `palavreado-board__tile--place-guessed`
            )}
            onClick={() => (!locked ? onLetterSelection(index) : null)}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
