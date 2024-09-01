//Design Resources
import { Button, Tooltip } from 'antd';
import { MinusSquareOutlined, PlusCircleFilled } from '@ant-design/icons';
// Types
import type { GamePlayer } from 'types/player';
import type { Clue, GridCell } from '../utils/types';
// Utils
import { getClueFromKey } from '../utils/helpers';
// Components
import { ClueCard } from './ClueCard';
import { PreviousClue } from './PreviousClue';
import { Translate } from 'components/language';

type SelectableCellProps = {
  onSelectCell: GenericFunction;
  onClearCell: GenericFunction;
  cell: GridCell;
  active: any;
  guesses: any;
  clues: Clue[];
  user: GamePlayer;
};

export function SelectableCell({
  onSelectCell,
  onClearCell,
  cell,
  active,
  guesses,
  clues,
  user,
}: SelectableCellProps) {
  const isSelected = cell.index === active;
  const matchEntry = Object.entries(guesses).find((arr) => arr[1] === cell.index);
  const [clueKey, coordinate] = matchEntry ?? [];
  const [clue, playerId] = getClueFromKey(clueKey ?? '');

  const isMatched = coordinate === cell.index;

  if (isMatched) {
    const clueIndexColor = clues.findIndex((c) => c.clue === clue && c.playerId === playerId);
    return (
      <Button
        onClick={user.id !== playerId ? () => onClearCell(clueKey) : () => {}}
        type="text"
        style={{ height: 'auto' }}
      >
        <ClueCard isMatched={isMatched} isSelected={isSelected} clue={clue} indexColor={clueIndexColor} />
      </Button>
    );
  }

  if (cell.text) {
    return <PreviousClue clue={cell.text} />;
  }

  if (cell.playerId === user.id) {
    return (
      <Tooltip
        title={
          <Translate
            pt="Essa célula pertence a uma de duas outras dicas, então não pode ser essa"
            en="This cell belongs to one of two other clues, so it can't be this one"
          />
        }
      >
        <Button shape="circle" ghost>
          <MinusSquareOutlined />
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button onClick={() => onSelectCell(cell.index)} shape="circle">
      <PlusCircleFilled style={isSelected ? { color: 'gold' } : {}} />
    </Button>
  );
}
