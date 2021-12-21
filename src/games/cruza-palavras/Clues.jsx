import PropTypes from 'prop-types';
// Components
import ClueCard from './ClueCard';
import { getClueKey } from './helpers';

function Clues({ clues, onSelectClue, active, guesses }) {
  return (
    <ul className="x-clue-cards">
      {clues.map((clueObj, index) => {
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

Clues.propTypes = {
  active: PropTypes.shape({
    coordinate: PropTypes.any,
  }),
  clues: PropTypes.shape({
    map: PropTypes.func,
  }),
  guesses: PropTypes.any,
  onSelectClue: PropTypes.func,
};

export default Clues;
