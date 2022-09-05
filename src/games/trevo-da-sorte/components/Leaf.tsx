import { RedoOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { useDrag } from 'react-dnd';

type LeafProps = {
  leaf: Leaf;
  allowLeafRotation: boolean;
  position?: LeafPosition;
  onRotateLeaf?: (id: LeafId) => void;
  allowDragging?: boolean;
  rotation?: number;
};

export function Leaf({
  leaf,
  allowLeafRotation,
  position,
  onRotateLeaf,
  allowDragging,
  rotation,
}: LeafProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: leaf.id,
      item: { id: leaf.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [leaf.id]
  );

  return (
    <div
      key={`leaf-key-${leaf.id}`}
      ref={allowDragging ? drag : undefined}
      className={clsx(
        position && `y-clover__leaf-${position}`,
        'y-clover-leaf',
        allowDragging && `y-clover-leaf--draggable`,
        isDragging && `y-clover-leaf--dragging`
      )}
      style={{ transform: `rotate(${rotation ?? leaf.rotation}deg)` }}
    >
      {leaf.cards.map((card: DefaultTextCard, cIndex: number) => (
        <div key={card.id} className={clsx('y-clover-leaf__card', `y-clover-leaf__card--${cIndex}`)}>
          <div className="y-clover-leaf__card-text">{card.text}</div>
        </div>
      ))}
      {allowLeafRotation ? (
        <button
          onClick={onRotateLeaf ? () => onRotateLeaf(leaf.id) : undefined}
          className="y-clover-leaf__center y-clover-leaf__center--rotatable"
        >
          <RedoOutlined />
        </button>
      ) : (
        <div className="y-clover-leaf__center">.</div>
      )}
    </div>
  );
}
