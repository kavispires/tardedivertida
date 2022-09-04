import { RedoOutlined } from '@ant-design/icons';
import clsx from 'clsx';

type LeafProps = {
  leaf: Leaf;
  allowLeafRotation: boolean;
  position?: LeafPosition;
  onRotateLeaf?: (id: LeafId) => void;
};

export function Leaf({ leaf, allowLeafRotation, position, onRotateLeaf }: LeafProps) {
  return (
    <div
      key={`clue-key-${leaf.id}`}
      className={clsx(
        position && `y-clover__leaf-${position}`,
        'y-clover-leaf'

        // `y-clover-rotation--${rotations[leafIndex]}`
      )}
    >
      {leaf.cards.map((card: any, cIndex: number) => (
        <div key={card.id} className={clsx('y-clover-leaf__card', `y-clover-leaf__card--${cIndex}`)}>
          <div className="y-clover-leaf__card-text">{card.text}</div>
        </div>
      ))}
      {allowLeafRotation && (
        <button
          onClick={onRotateLeaf ? () => onRotateLeaf(leaf.id) : undefined}
          className="y-clover-leaf__center y-clover-leaf__center--rotatable"
        >
          <RedoOutlined />
        </button>
      )}
    </div>
  );
}
