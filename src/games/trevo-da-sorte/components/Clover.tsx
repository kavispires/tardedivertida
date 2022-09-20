import clsx from 'clsx';
import { useRef } from 'react';
import { useKeyPressEvent } from 'react-use';
// Ant Design Resources
import { Button, Input } from 'antd';
import { RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { FIRST_ATTEMPT_SCORE, ROTATIONS, SECOND_ATTEMPT_SCORE } from '../utils/constants';
// Components
import { LeafSlot } from './LeafSlot';
import { BoxXIcon } from 'components/icons/BoxXIcon';
import { BoxOneIcon } from 'components/icons/BoxOneIcon';
import { BoxCheckMarkIcon } from 'components/icons/BoxCheckMarkIcon';

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
  const inputRefs = useRef<any[]>([]);
  const { translate } = useLanguage();
  const cloverLeaves = Object.entries(clover.leaves);

  useKeyPressEvent('Tab', () => {
    onRotate(-1);
  });

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
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={onClueChange ? (e) => onClueChange(leafIndex, e.target.value) : undefined}
                  className={`y-clover-rotation--${ROTATIONS[index]} y-clover-input`}
                  placeholder={translate('Escreva aqui', 'Write here')}
                  disabled={!Boolean(onClueChange)}
                  value={mode === 'write' ? undefined : cloverLeaf.clue}
                  autoFocus={index === 0}
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
          const {
            leaf,
            rotation: leafRotation,
            icon,
          } = getLeaf(mode, leaves, cloverLeafPosition as LeafPosition, cloverLeaf, guesses, rotations);

          return (
            <LeafSlot
              key={`slot-${cloverLeafPosition}`}
              leaf={leaf}
              rotation={leafRotation}
              position={cloverLeafPosition as LeafPosition}
              onLeafGrab={onLeafGrab}
              onLeafRotate={onLeafRotate}
              onLeafRemove={onLeafRemove}
              activeSlotId={activeSlotId}
              onActivateSlot={onActivateSlot}
              isLocked={locks?.[cloverLeafPosition as LeafPosition] ?? false}
              icon={icon}
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

const getLeaf = (
  mode: CloverMode,
  leaves: Leaves,
  position: LeafPosition,
  cloverLeaf: CloverLeaf,
  guesses: YGuesses,
  rotations: NumberDictionary
) => {
  let leafId = '';
  switch (mode) {
    case 'guess':
      leafId = guesses?.[position]?.leafId ?? '';
      return {
        leaf: leaves?.[leafId],
        rotation: rotations[leafId] ?? 0,
        icon: undefined,
      };
    case 'result':
      leafId = guesses?.[position]?.leafId ?? '';
      const guess = guesses?.[position];
      return {
        leaf: leaves?.[leafId],
        rotation: guess?.rotation ?? 0,
        icon: getIcon(guess?.score ?? 0),
      };
    case 'write':
      leafId = cloverLeaf.leafId;
      return {
        leaf: leaves?.[leafId],
        rotation: rotations[leafId] ?? 0,
        icon: undefined,
      };
    case 'view':
    default:
      leafId = cloverLeaf.leafId;
      return {
        leaf: leaves?.[leafId],
        rotation: cloverLeaf.rotation,
        icon: undefined,
      };
  }
};

/**
 * Get the result icon based on score
 * @param score
 * @returns
 */
const getIcon = (score: number) => {
  switch (score) {
    case SECOND_ATTEMPT_SCORE:
      return <BoxOneIcon />;
    case FIRST_ATTEMPT_SCORE:
      return <BoxCheckMarkIcon />;
    case 0:
    default:
      return <BoxXIcon />;
  }
};
