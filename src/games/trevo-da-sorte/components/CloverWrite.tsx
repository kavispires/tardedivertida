import clsx from 'clsx';
// Ant Design Resources
import { Input, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { ROTATIONS } from '../utils/constants';
// Components
import { LeafSlot } from './LeafSlot';
import { CloverRotationControls } from './CloverRotationControls';

type CloverWriteProps = {
  leaves: Leaves;
  clues: string[];
  onRotateClover: (direction: number) => void;
  rotation: number;
  onChangeClue: (targetIndex: LeafIndex, value: string) => void;
  results: YGuesses;
};

export function CloverWrite({
  leaves,
  clues,
  rotation,
  onChangeClue,
  results,
  onRotateClover,
}: CloverWriteProps) {
  const { translate } = useLanguage();

  return (
    <Space className="space-container" align="center">
      <div className="container center">
        <div className="y-clover" style={{ transform: `rotate(${rotation}deg)` }}>
          {/* ANSWERS */}
          {clues.map((_, index) => {
            const leafIndex = Number(index) as LeafIndex;

            return (
              <div
                key={`clue-key-${leafIndex}`}
                className={clsx(`y-clover__clue-${leafIndex}`, 'y-clover-clue')}
              >
                <Input
                  onChange={onChangeClue ? (e) => onChangeClue(leafIndex, e.target.value) : undefined}
                  className={`y-clover-rotation--${ROTATIONS[index]} y-clover-input`}
                  placeholder={translate('Escreva aqui', 'Write here')}
                  disabled={!Boolean(onChangeClue)}
                />
              </div>
            );
          })}

          {/* LEAVES */}
          {Object.entries(results).map(([leafPosKey, result]) => (
            <LeafSlot
              key={`slot-${leafPosKey}`}
              leaf={result ? leaves[result.leafId] : undefined}
              allowLeafRotation={false}
              position={leafPosKey as LeafPosition}
            />
          ))}
        </div>

        <CloverRotationControls onRotateClover={onRotateClover} />
      </div>
    </Space>
  );
}
