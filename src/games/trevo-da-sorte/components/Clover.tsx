import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import clsx from 'clsx';
import { ROTATIONS } from '../utils/constants';
import { LeafSlot } from './LeafSlot';

type CloverProps = {
  // mode: CloverMode;
  // clover: Clover;
  mode: CloverMode;
  leaves: Leaves;
  clues: string[];
  rotation: number;
  onChangeClue?: (targetIndex: LeafIndex, value: string) => void;
  guesses: YGuesses;
  allowLeafRotation: boolean;
  onRotateClover: (direction: number) => void;
  onDrop?: GenericFunction;
  onRotateLeaf?: (id: LeafId) => void;
};

export function Clover({
  leaves,
  clues,
  rotation,
  onChangeClue,
  guesses,
  allowLeafRotation,
  onDrop,
  onRotateClover,
  onRotateLeaf,
  mode,
}: CloverProps) {
  const leavesIds = Object.keys(leaves);
  console.log({ mode });
  return (
    <div className="container center">
      <div className="y-clover" style={{ transform: `rotate(${rotation}deg)` }}>
        {/* ANSWERS */}
        {clues.map((clue, index) => {
          const leafIndex = Number(index) as LeafIndex;

          if (mode === 'write') {
            return (
              <div
                key={`clue-key-${leafIndex}`}
                className={clsx(`y-clover__clue-${leafIndex}`, 'y-clover-clue')}
              >
                <Input
                  onChange={onChangeClue ? (e) => onChangeClue(leafIndex, e.target.value) : undefined}
                  className={`y-clover-rotation--${ROTATIONS[index]} y-clover-input`}
                  placeholder={'Write here'}
                  disabled={!Boolean(onChangeClue)}
                  value={mode === 'write' ? undefined : clue}
                />
              </div>
            );
          }

          return (
            <div
              key={`clue-key-${leafIndex}`}
              className={clsx(`y-clover__clue-${leafIndex}`, 'y-clover-clue')}
            >
              <span className={clsx(`y-clover-rotation--${ROTATIONS[index]}`, 'y-clover-clue-readonly')}>
                {clue}
              </span>
            </div>
          );
        })}

        {/* LEAVES */}
        {Object.entries(guesses).map(([leafPosKey, guess], index) => (
          <LeafSlot
            key={`slot-${leafPosKey}`}
            leaf={guess ? leaves[guess.leafId] : undefined}
            allowLeafRotation={allowLeafRotation}
            position={leafPosKey as LeafPosition}
            leavesIds={leavesIds}
            onDrop={onDrop}
            onRotateLeaf={onRotateLeaf}
          />
        ))}
      </div>
      <div className="controls space-container center">
        <Button icon={<RotateLeftOutlined />} onClick={() => onRotateClover(-1)} />
        <Button icon={<RotateRightOutlined />} onClick={() => onRotateClover(1)} />
      </div>
    </div>
  );
}