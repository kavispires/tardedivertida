import clsx from 'clsx';
import { Translate } from 'components/language';

import { PalavreadoLetter } from '../utils/type';

type WordProps = {
  letters: PalavreadoLetter[];
  selection: number[];
  onLetterSelection: (index: number) => void;
  onSubmitWord: () => void;
  latestWord: string;
};

export function Word({ letters, onLetterSelection, selection, onSubmitWord, latestWord }: WordProps) {
  const paddedSelection = selection.concat(Array(4 - selection.length).fill(null));

  return (
    <div className="palavreado-word">
      {paddedSelection.map((letterIndex, index) => {
        const letterObj = letters.find((l) => l.index === letterIndex);

        if (!letterObj) {
          return (
            <div key={`${letterIndex}-${index}`} className="palavreado-word__entry">
              <button key={`${letterIndex}-${index}`} className="palavreado-word__tile">
                {' '}
              </button>
              <div className="palavreado-word__latest-letter">{latestWord[index] ?? ' '}</div>
            </div>
          );
        }

        return (
          <div key={`${letterIndex}-${index}`} className="palavreado-word__entry">
            <button
              key={`${letterIndex}-${index}`}
              className={clsx(
                'palavreado-word__tile',
                'palavreado-word__tile--button',
                `palavreado-word__tile--${letterObj.state}`
              )}
              onClick={() => onLetterSelection(letterIndex)}
            >
              {letterObj.letter}
            </button>
            <div className="palavreado-word__latest-letter">{latestWord[index]}</div>
          </div>
        );
      })}

      <button type="button" className="palavreado-word__enter" onClick={onSubmitWord}>
        <Translate pt="Enviar" en="Submit" />
      </button>
    </div>
  );
}
