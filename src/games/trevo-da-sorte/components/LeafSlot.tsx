import { Avatar } from 'antd';
import clsx from 'clsx';
import { TransparentButton } from 'components/buttons';
import { Leaf } from './Leaf';

type LeafSlotProps = {
  leaf?: Leaf;
  position: LeafPosition;
  allowLeafRotation: boolean;
  activeSlotId?: LeafPosition | null;
  onActivateSlot?: GenericFunction;
  onRotateLeaf?: (e: any, id: LeafId) => void;
  rotation?: number;
};

export function LeafSlot({
  leaf,
  position,
  allowLeafRotation,
  onActivateSlot,
  onRotateLeaf,
  activeSlotId,
  rotation,
}: LeafSlotProps) {
  // const isActive = isOver && canDrop;
  // const isActive = false;

  if (Boolean(onActivateSlot)) {
    return (
      <TransparentButton
        onClick={() => onActivateSlot!(position)}
        active={activeSlotId === position}
        className={clsx(`y-clover__leaf-${position}`)}
      >
        <LeafSlotContent
          leaf={leaf}
          allowLeafRotation={true}
          position={position}
          onRotateLeaf={onRotateLeaf}
          onActivateSlot={onActivateSlot}
          activeSlotId={activeSlotId}
          rotation={rotation}
        />
      </TransparentButton>
    );
  }

  return (
    <div className={clsx(`y-clover__leaf-${position}`)}>
      <LeafSlotContent
        leaf={leaf}
        allowLeafRotation={true}
        position={position}
        onRotateLeaf={onRotateLeaf}
        onActivateSlot={onActivateSlot}
        activeSlotId={activeSlotId}
        rotation={rotation}
      />
    </div>
  );
}

function LeafSlotContent({ leaf, position, allowLeafRotation, onRotateLeaf, rotation }: LeafSlotProps) {
  return Boolean(leaf) ? (
    <Leaf
      key={leaf!.id}
      leaf={leaf!}
      allowLeafRotation={allowLeafRotation}
      position={position as LeafPosition}
      onRotateLeaf={onRotateLeaf}
      rotation={rotation}
    />
  ) : (
    <div key={`clue-key-${position}`} className={clsx('y-clover-leaf', 'y-clover-leaf--empty')}>
      <Avatar className="y-clover-leaf__empty-avatar">?</Avatar>
    </div>
  );
}
