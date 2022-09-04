import { RedoOutlined, RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import clsx from 'clsx';
import { ROTATIONS } from '../utils/constants';
import { Leaf } from './Leaf';

type CloverProps = {
  // mode: CloverMode;
  // clover: Clover;
  leaves: Leaves;
  clues: string[];
  rotation: number;
  onChangeClue?: (targetIndex: LeafIndex, value: string) => void;
  guesses: YGuesses;
  allowLeafRotation: boolean;
  onRotateClover: (direction: number) => void;
};

export function Clover({
  leaves,
  clues,
  rotation,
  onChangeClue,
  guesses,
  allowLeafRotation,

  onRotateClover,
}: CloverProps) {
  console.log({ clues });

  return (
    <div className="container center">
      <div className="y-clover" style={{ transform: `rotate(${rotation}deg)` }}>
        {/* ANSWERS */}
        {clues.map((clue, index) => {
          const leafIndex = Number(index) as LeafIndex;

          return (
            <div
              key={`clue-key-${leafIndex}`}
              className={clsx(`y-clover__clue-${leafIndex}`, 'y-clover-clue')}
            >
              <Input
                defaultValue={clue}
                onChange={onChangeClue ? (e) => onChangeClue(leafIndex, e.target.value) : undefined}
                className={`y-clover-rotation--${ROTATIONS[index]} y-clover-input`}
                placeholder={'Write here'}
                disabled={!Boolean(onChangeClue)}
              />
            </div>
          );
        })}

        {/* LEAVES */}
        {Object.entries(guesses).map(([leafPosKey, guess], index) => {
          if (guess) {
            const leaf = leaves[guess.leafId];
            return (
              <Leaf leaf={leaf} allowLeafRotation={allowLeafRotation} position={leafPosKey as LeafPosition} />
            );
          }

          return (
            <div
              key={`clue-key-${leafPosKey}`}
              className={clsx(`y-clover__leaf-${leafPosKey}`, 'y-clover-leaf', 'y-clover-leaf--empty')}
            >
              ?
            </div>
          );
        })}
      </div>
      <div className="controls space-container center">
        <Button icon={<RotateLeftOutlined />} onClick={() => onRotateClover(-1)} />
        <Button icon={<RotateRightOutlined />} onClick={() => onRotateClover(1)} />
      </div>
    </div>
  );
}
