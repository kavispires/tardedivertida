import { orderBy } from 'lodash';
// Ant Design Resources
import { Space } from 'antd';
// Components
import { LeafSlot } from './LeafSlot';
import { CloverRotationControls } from './CloverRotationControls';
import { Leaf } from './Leaf';
import { Instruction } from 'components/text';
import { LeafClue } from './LeafClue';
import { TransparentButton } from 'components/buttons';

type CloverGuessProps = {
  leaves: Leaves;
  clues: string[];
  guesses: YGuesses;
  onRotateClover: (direction: number) => void;
  rotation: number;
  onRotateLeaf: (e: any, leadId: LeafId) => void;
  rotations: NumberDictionary;
  onActivateLeaf: GenericFunction;
  activeLeafId: LeafId | null;
  onActivateSlot: GenericFunction;
  activeSlotId: LeafPosition | null;
};

export function CloverGuess({
  leaves,
  clues,
  guesses,
  onRotateClover,
  rotation,
  onRotateLeaf,
  rotations,
  onActivateLeaf,
  activeLeafId,
  onActivateSlot,
  activeSlotId,
}: CloverGuessProps) {
  return (
    <Space className="space-container" align="center">
      <div className="container center">
        <div className="y-clover" style={{ transform: `rotate(${rotation}deg)` }}>
          {/* ANSWERS */}
          {clues.map((clue, index) => {
            const leafIndex = Number(index) as LeafIndex;
            return (
              <LeafClue key={`clue-key-${leafIndex}`} leafIndex={leafIndex} index={index}>
                {clue}
              </LeafClue>
            );
          })}

          {/* LEAVES */}
          {Object.entries(guesses).map(([leafPosKey, guess], index) => (
            <LeafSlot
              key={`slot-${leafPosKey}`}
              leaf={guess ? leaves[guess.leafId] : undefined}
              allowLeafRotation={true}
              position={leafPosKey as LeafPosition}
              onRotateLeaf={onRotateLeaf}
              onActivateSlot={onActivateSlot}
              activeSlotId={activeSlotId}
              rotation={guess ? rotations[guess.leafId] : undefined}
            />
          ))}
        </div>

        <CloverRotationControls onRotateClover={onRotateClover} />
      </div>

      <Instruction contained>
        <Space className="space-container" align="center" wrap>
          {orderBy(Object.values(leaves), 'id').map((leaf) => {
            return (
              <TransparentButton
                key={leaf.id}
                onClick={() => onActivateLeaf(leaf.id)}
                active={activeLeafId === leaf.id}
              >
                <div className="y-leaf-loose">
                  <Leaf
                    leaf={leaf}
                    allowLeafRotation
                    allowDragging
                    onRotateLeaf={onRotateLeaf}
                    rotation={rotations?.[leaf.id]}
                  />
                </div>
              </TransparentButton>
            );
          })}
        </Space>
      </Instruction>
    </Space>
  );
}
