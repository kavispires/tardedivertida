import clsx from 'clsx';
import { useDrop } from 'react-dnd';
import { Leaf } from './Leaf';

type LeafSlotProps = {
  leaf?: Leaf;
  position: LeafPosition;
  allowLeafRotation: boolean;
  leavesIds?: string[];
  onDrop?: GenericFunction;
  onRotateLeaf?: (id: LeafId) => void;
};

export function LeafSlot({
  leaf,
  position,
  allowLeafRotation,
  leavesIds,
  onDrop,
  onRotateLeaf,
}: LeafSlotProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: leavesIds ?? [],
    drop: onDrop ? (item) => onDrop(item, position) : undefined,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div
      ref={Boolean(onDrop) ? drop : undefined}
      className={clsx(`y-clover__leaf-${position}`, isActive && 'y-clover-leaf-drop')}
    >
      {Boolean(leaf) ? (
        <Leaf
          key={leaf!.id}
          leaf={leaf!}
          allowLeafRotation={allowLeafRotation}
          position={position as LeafPosition}
          onRotateLeaf={onRotateLeaf}
        />
      ) : (
        <div key={`clue-key-${position}`} className={clsx('y-clover-leaf', 'y-clover-leaf--empty')}>
          ?
        </div>
      )}
    </div>
  );
}
