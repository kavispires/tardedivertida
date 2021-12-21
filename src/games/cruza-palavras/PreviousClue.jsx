import PropTypes from 'prop-types';

function PreviousClue({ clue }) {
  return <div className="x-previous-clue">{clue}</div>;
}

PreviousClue.propTypes = {
  clue: PropTypes.string,
};

export default PreviousClue;
