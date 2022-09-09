import { Avatar, Space } from 'antd';
import { Instruction } from 'components/text';
import { orderBy } from 'lodash';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCloverState } from '../utils/useCloverState';
import { Clover } from './Clover';
import { Leaf } from './Leaf';

type DndCloverProps = {
  mode: CloverMode;
  // All modes
  clover: Clover;
  leaves: Leaves;
  onRotateClover: (direction: number) => void;
  clues: string[];
  rotation: number;
  guesses: YGuesses;
  allowLeafRotation: boolean;
  // Write mode
  onChangeClue?: (targetIndex: LeafIndex, value: string) => void;
  // Guess mode
  onSubmitGuess?: GenericFunction;
  // controller?: GamePlayer;
  // isUserTheController?: boolean;
  // activeCloverPlayer?: GamePlayer;
  // isUserTheCloverPlayer?: boolean;
  onUpdateCloverState?: GenericComponent;
};

export function DndClover({
  mode,
  clover,
  leaves,
  onChangeClue,
  onSubmitGuess,
  onUpdateCloverState,
}: DndCloverProps) {
  const { rotation, rotations, onRotateLeaf, onRotateClover, clues, guesses, allowLeafRotation } =
    useCloverState(mode, clover, leaves, onUpdateCloverState);

  const onDrop = (payload: { id: LeafId }, slot: LeafPosition) => {
    if (onUpdateCloverState) {
      onUpdateCloverState({
        change: {
          [`clover.guess.${slot}`]: {
            leafId: payload.id,
            rotation: rotations[payload.id],
          },
        },
      });
    }
  };

  return (
    <Space className="space-container" align="center">
      <Clover
        leaves={leaves}
        clues={clues}
        rotation={rotation}
        guesses={guesses}
        allowLeafRotation={allowLeafRotation}
        onRotateClover={onRotateClover}
        onChangeClue={onChangeClue}
        onRotateLeaf={mode === 'guess' ? onRotateLeaf : undefined}
        onDrop={onDrop}
        mode={mode}
      />
      {mode === 'guess' && (
        <Instruction contained>
          <Space className="space-container" align="center" wrap>
            {orderBy(Object.values(leaves), 'id').map((leaf, index) => {
              return (
                <div className="y-leaf-loose" key={leaf.id}>
                  <Avatar>{index + 1}</Avatar>
                  <Leaf
                    leaf={leaf}
                    allowLeafRotation
                    allowDragging
                    onRotateLeaf={onRotateLeaf}
                    rotation={rotations?.[leaf.id]}
                  />
                </div>
              );
            })}
          </Space>
        </Instruction>
      )}
    </Space>
  );
}
