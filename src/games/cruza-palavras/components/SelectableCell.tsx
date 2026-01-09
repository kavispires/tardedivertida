// Ant Design Resources
import { MinusSquareOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Flex, Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
// Internal
import type { Clue, GridCell } from '../utils/types';
import { getClueFromKey } from '../utils/helpers';
import { ClueCard } from './ClueCard';
import { PreviousClue } from './PreviousClue';
import { DroppableArea } from '../../../components/drag-and-drop/DragAndDrop';
import { DraggableClue } from './DraggableClue';

type SelectableCellProps = {
  onActivateClue: (clue: Clue) => void;
  cell: GridCell;
  active: Clue | number | null;
  guesses: NumberDictionary;
  clues: Clue[];
  clueColors: Dictionary<string>;
  user: GamePlayer;
};

export function SelectableCell({
  onActivateClue,
  cell,
  active,
  guesses,
  clues,
  clueColors,
  user,
}: SelectableCellProps) {
  const isSelected = cell.index === active;
  const matchEntry = Object.entries(guesses).find((arr) => arr[1] === cell.index);
  const [clueKey, coordinate] = matchEntry ?? [];
  const [clue, playerId] = getClueFromKey(clueKey ?? '');

  const isMatched = coordinate === cell.index;

  // Check if this is the player's own clue cell
  const isPlayerOwnClueCell = isMatched && playerId === user.id;

  // Determine if the cell can be a drop target
  const isDropDisabled = Boolean(cell.text) || cell.playerId === user.id || isMatched;

  if (isMatched && isPlayerOwnClueCell) {
    return (
      <Tooltip
        title={
          <Translate
            pt="Essa é a sua própria dica!"
            en="This is your own clue!"
          />
        }
      >
        <ClueCard
          isMatched={isMatched}
          isSelected={isSelected}
          clue={clue || clues.find((c) => c.playerId === user.id)?.clue}
          color={clueColors[clue]}
        />
      </Tooltip>
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
        <Button
          shape="circle"
          ghost
        >
          <MinusSquareOutlined />
        </Button>
      </Tooltip>
    );
  }

  if (isMatched) {
    const clueObj = clues.find((c) => c.clue === clue && c.playerId === playerId);

    if (!clueObj) return;

    return (
      <DraggableClue
        clue={clueObj}
        isSelected={isSelected}
        isMatched={false}
        onActivateClue={onActivateClue}
        color={clueColors[clue]}
        // Disable dragging for player's own clue
        disabled={playerId === user.id}
      />
    );
  }

  return (
    <DroppableArea
      id={cell.index}
      disabled={isDropDisabled}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '4rem', // Match the spreadsheet cell min-height
      }}
    >
      <Flex
        style={{
          outline: isSelected ? '2px solid gold' : 'none',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'inherit', // Inherit from parent
        }}
        align="center"
        justify="center"
        vertical={false}
      >
        <PlusCircleFilled style={{ color: 'white' }} />
      </Flex>
    </DroppableArea>
  );
}
