import PropTypes from 'prop-types';
//Design Resources
import { Button } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
// Components
import ClueCard from './ClueCard';
import PreviousClue from './PreviousClue';
import { getClueFromKey } from './helpers';

function SelectableCell({ onSelectCell, cell, active, guesses, clues }) {
  const isSelected = cell.index === active;
  const matchEntry = Object.entries(guesses).find((arr) => arr[1] === cell.index);
  const [clueKey, coordinate] = matchEntry ?? [];
  const [clue, playerId] = getClueFromKey(clueKey ?? '');

  const isMatched = coordinate === cell.index;

  if (isMatched) {
    const clueIndexColor = clues.findIndex((c) => c.clue === clue && c.playerId === playerId);
    return <ClueCard isMatched={isMatched} isSelected={isSelected} clue={clue} indexColor={clueIndexColor} />;
  }

  if (cell.text) {
    return <PreviousClue clue={cell.text} />;
  }

  return (
    <Button onClick={() => onSelectCell(cell.index)} shape="circle">
      <PlusCircleFilled style={isSelected ? { color: 'gold' } : {}} />
    </Button>
  );
}

SelectableCell.propTypes = {
  active: PropTypes.any,
  cell: PropTypes.shape({
    index: PropTypes.any,
  }),
  clues: PropTypes.shape({
    findIndex: PropTypes.func,
  }),
  guesses: PropTypes.any,
  onSelectCell: PropTypes.func,
};

export default SelectableCell;
