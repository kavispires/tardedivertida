// Components
import ClueCard from './ClueCard';
import { getClueKey } from './helpers';

type CluesProps = {
  clues: CruzaPalavrasClue[];
  onSelectClue: GenericFunction;
  active: any;
  guesses: PlainObject;
};

function Clues({ clues, onSelectClue, active, guesses }: CluesProps) {
  return (
    <ul className="x-clue-cards">
      {clues.map((clueObj, index: number) => {
        const isSelected = clueObj.coordinate === active?.coordinate;
        const isMatched = Boolean(guesses[getClueKey(clueObj)]);
        return (
          <li key={`${clueObj.coordinate}-${clueObj.clue}`} className="x-clue-card-li">
            <button className="x-clue-card-button" onClick={() => onSelectClue(clueObj)}>
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

export default Clues;
