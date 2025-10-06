// Internal
import type { Clue } from '../utils/types';
import { getClueKey } from '../utils/helpers';
import { DraggableItem } from '../../../components/drag-and-drop/DragAndDrop';
import { ClueCard } from './ClueCard';

type DraggableClueProps = {
  clue: Clue;
  isSelected: boolean;
  isMatched: boolean;
  onActivateClue: (clue: Clue) => void;
  color: string;
  disabled?: boolean;
};

export function DraggableClue({
  clue,
  isSelected,
  isMatched,
  onActivateClue,
  color,
  disabled = false,
}: DraggableClueProps) {
  const clueKey = getClueKey(clue);

  return (
    <DraggableItem
      id={clueKey}
      disabled={disabled}
      onClick={() => onActivateClue(clue)}
      className="x-clue-card-draggable"
      options={{
        dragOpacity: 0.8,
        dragScale: 1.03,
        withTransition: true,
      }}
    >
      <ClueCard isMatched={isMatched} isSelected={isSelected} clue={clue.clue} color={color} strikeMatches />
    </DraggableItem>
  );
}
