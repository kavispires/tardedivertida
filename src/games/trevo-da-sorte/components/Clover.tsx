import clsx from 'clsx';
// Ant Design Resources
import { Button, Input } from 'antd';
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { ROTATIONS } from '../utils/constants';
// Components
import { LeafSlot } from './LeafSlot';

type CloverProps = {
  mode: CloverMode;
  clover: Clover;
  leaves: Leaves;
  guesses?: any;
  rotation: number;
  onRotate: (direction: number) => void;
  onClueChange?: (targetIndex: LeafIndex, value: string) => void;
  rotations?: NumberDictionary;
  onLeafRotate?: GenericFunction;
  onLeafRemove?: GenericFunction;
  activeLeafId?: LeafId | null;
  activeSlotId?: LeafPosition | null;
  onLeafGrab?: GenericFunction;
  onActivateSlot?: GenericFunction;
  locks?: LeafLocks;
};

export function Clover({
  mode,
  clover,
  leaves,
  guesses,
  rotation,
  onRotate,
  onClueChange,
  rotations = {},
  onLeafRotate,
  onLeafRemove,
  activeSlotId,
  onLeafGrab,
  onActivateSlot,
  locks,
}: CloverProps) {
  const { translate } = useLanguage();
  const cloverLeaves = Object.entries(clover.leaves);

  return (
    <div className="container center">
      <div className="y-clover" style={{ transform: `rotate(${rotation}deg)` }}>
        {/* ANSWERS */}
        {cloverLeaves.map(([_, cloverLeaf], index) => {
          const leafIndex = Number(index) as LeafIndex;

          if (mode === 'write' && onClueChange) {
            return (
              <div
                key={`clue-key-${leafIndex}`}
                className={clsx(`y-clover__clue-${leafIndex}`, 'y-clover-clue')}
              >
                <Input
                  onChange={onClueChange ? (e) => onClueChange(leafIndex, e.target.value) : undefined}
                  className={`y-clover-rotation--${ROTATIONS[index]} y-clover-input`}
                  placeholder={translate('Escreva aqui', 'Write here')}
                  disabled={!Boolean(onClueChange)}
                  value={mode === 'write' ? undefined : cloverLeaf.clue}
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
                {cloverLeaf.clue}
              </span>
            </div>
          );
        })}

        {/* LEAVES */}
        {cloverLeaves.map(([cloverLeafPosition, cloverLeaf]) => {
          const resultView = mode !== 'guess';
          const leafId = resultView ? cloverLeaf.leafId : guesses?.[cloverLeafPosition]?.leafId;
          const leaf = leaves?.[leafId];
          const rotation = resultView ? cloverLeaf.rotation : rotations[leaf?.id ?? ''] ?? 0;
          return (
            <LeafSlot
              key={`slot-${cloverLeafPosition}`}
              leaf={leaf}
              rotation={rotation}
              position={cloverLeafPosition as LeafPosition}
              onLeafGrab={onLeafGrab}
              onLeafRotate={onLeafRotate}
              onLeafRemove={onLeafRemove}
              activeSlotId={activeSlotId}
              onActivateSlot={onActivateSlot}
              isLocked={locks?.[cloverLeafPosition as LeafPosition] ?? false}
            />
          );
        })}
      </div>
      <div className="controls space-container center">
        <Button icon={<RotateLeftOutlined />} onClick={() => onRotate(-1)} />
        <Button icon={<RotateRightOutlined />} onClick={() => onRotate(1)} />
      </div>
    </div>
  );
}
