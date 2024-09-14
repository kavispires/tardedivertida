import clsx from 'clsx';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Internal
import { PalavreadoLetter } from '../utils/types';

type BoardProps = {
  letters: PalavreadoLetter[];
  selection: number | null;
  swap: number[];
  onLetterSelection: (index: number) => void;
  guesses: string[][];
  size: number;
};

export function Board({ letters, onLetterSelection, selection, swap, guesses, size }: BoardProps) {
  return (
    <div
      className="palavreado-board"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {letters.map(({ letter, locked, state }, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
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
