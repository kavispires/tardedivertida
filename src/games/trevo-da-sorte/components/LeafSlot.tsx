import clsx from 'clsx';
import { ReactNode } from 'react';
// Components
import { Leaf } from './Leaf';
import { GuessIcon } from 'components/icons/GuessIcon';
import { IconAvatar } from 'components/icons/IconAvatar';

type LeafSlotProps = {
  leaf?: Leaf;
  rotation?: number;
  position?: LeafPosition;
  onLeafGrab?: GenericFunction;
  onLeafRotate?: GenericFunction;
  onLeafRemove?: GenericFunction;
  onActivateSlot?: GenericFunction;
  activeLeafId?: LeafId | null;
  activeSlotId?: LeafPosition | null;
  className?: string;
  isLocked?: boolean;
  icon?: ReactNode;
};

export function LeafSlot({
  leaf,
  rotation,
  position,
  onLeafGrab,
  onLeafRotate,
  onLeafRemove,
  activeSlotId,
  onActivateSlot,
  isLocked,
  icon,
}: LeafSlotProps) {
  if (!leaf && onActivateSlot) {
    return (
      <div className={clsx(`y-clover__leaf-${position}`, activeSlotId === position && 'active-class')}>
        <button
          key={`clue-key-${position}`}
          className={clsx(
            'y-leaf',
            'y-leaf--empty',
            'y-leaf--empty-clickable',
            activeSlotId === position && 'y-leaf--empty-active'
          )}
          onClick={(_) => onActivateSlot(position)}
        >
          <IconAvatar icon={<GuessIcon />} size="large" />
        </button>
      </div>
    );
  }

  if (Boolean(onLeafGrab)) {
    return (
      <div className={clsx(`y-clover__leaf-${position}`, activeSlotId === position && 'active-class')}>
        <LeafSlotContent
          leaf={leaf}
          position={position}
          rotation={rotation}
          onLeafGrab={() => onLeafGrab!(position)}
          onLeafRotate={onLeafRotate}
          onLeafRemove={onLeafRemove}
          isLocked={isLocked}
          icon={icon}
        />
      </div>
    );
  }

  return (
    <div className={clsx(`y-clover__leaf-${position}`)}>
      <LeafSlotContent
        leaf={leaf}
        position={position}
        rotation={rotation}
        onLeafRotate={onLeafRotate}
        onLeafRemove={onLeafRemove}
        isLocked={isLocked}
        icon={icon}
      />
    </div>
  );
}

function LeafSlotContent({
  leaf,
  rotation,
  position,
  onLeafGrab,
  onLeafRotate,
  onLeafRemove,
  isLocked,
  className = '',
  icon,
}: LeafSlotProps) {
  return Boolean(leaf) ? (
    <Leaf
      key={leaf!.id}
      leaf={leaf!}
      onLeafGrab={onLeafGrab}
      onLeafRotate={onLeafRotate}
      onLeafRemove={onLeafRemove}
      rotation={rotation}
      className={className}
      position={position}
      isLocked={isLocked}
      icon={icon}
    />
  ) : (
    <div key={`clue-key-${position}`} className={clsx('y-leaf', 'y-leaf--empty')}>
      <IconAvatar icon={<GuessIcon />} size="large" />
    </div>
  );
}
