//Design Resources
import { Button } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
// Utils
import { getClueFromKey } from './helpers';
// Components
import ClueCard from './ClueCard';
import PreviousClue from './PreviousClue';

type SelectableCellProps = {
  onSelectCell: GenericFunction;
  cell: CruzaPalavrasGridCell;
  active: any;
  guesses: any;
  clues: CruzaPalavrasClue[];
};

function SelectableCell({ onSelectCell, cell, active, guesses, clues }: SelectableCellProps) {
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

export default SelectableCell;
