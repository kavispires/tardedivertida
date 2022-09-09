import { orderBy } from 'lodash';
// Ant Design Resources
import { Space } from 'antd';
// Components
import { LeafSlot } from './LeafSlot';
import { CloverRotationControls } from './CloverRotationControls';
import { Leaf } from './Leaf';
import { Instruction } from 'components/text';
import { LeafClue } from './LeafClue';

type CloverWaitProps = {
  leaves: Leaves;
  clues: string[];
  guesses: YGuesses;
  onRotateClover: (direction: number) => void;
  rotation: number;
  onRotateLeaf: (e: any, leadId: LeafId) => void;
  rotations: NumberDictionary;
};

export function CloverWait({
  leaves,
  clues,
  guesses,
  onRotateClover,
  rotation,
  onRotateLeaf,
  rotations,
}: CloverWaitProps) {
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
          {Object.entries(guesses).map(([leafPosKey, result]) => (
            <LeafSlot
              key={`slot-${leafPosKey}`}
              allowLeafRotation={false}
              position={leafPosKey as LeafPosition}
            />
          ))}
        </div>

        <CloverRotationControls onRotateClover={onRotateClover} />
      </div>

      <Instruction contained>
        <Space className="space-container" align="center" wrap>
          {orderBy(Object.values(leaves), 'id').map((leaf, index) => {
            return (
              <div className="y-leaf-loose" key={leaf.id}>
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
    </Space>
  );
}
