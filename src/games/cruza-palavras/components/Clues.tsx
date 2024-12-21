// Internal
import type { Clue } from '../utils/types';
import { getClueKey } from '../utils/helpers';
import { ClueCard } from './ClueCard';

type CluesProps = {
  clues: Clue[];
  onSelectClue: GenericFunction;
  active: any;
  guesses: PlainObject;
};

export function Clues({ clues, onSelectClue, active, guesses }: CluesProps) {
  return (
    <ul className="x-clue-cards">
      {clues.map((clueObj, index: number) => {
        const isSelected = clueObj.coordinate === active?.coordinate;
        const isMatched = Boolean(guesses[getClueKey(clueObj)]);
        return (
          <li key={`${clueObj.coordinate}-${clueObj.clue}`} className="x-clue-card-li">
            <button type="button" className="x-clue-card-button" onClick={() => onSelectClue(clueObj)}>
              <ClueCard
                isMatched={isMatched}
                isSelected={isSelected}
                clue={clueObj.clue}
                indexColor={index}
                strikeMatches
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
