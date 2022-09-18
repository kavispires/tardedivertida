import { DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import clsx from 'clsx';
import { CloverIcon } from 'components/icons/CloverIcon';
import { IconAvatar } from 'components/icons/IconAvatar';
import { LockIcon } from 'components/icons/LockIcon';
import { getAnimationClass } from 'utils/helpers';

type LeafProps = {
  leaf: Leaf;
  rotation?: number;
  onLeafGrab?: GenericFunction;
  onLeafRemove?: GenericFunction;
  onLeafRotate?: GenericFunction;
  className?: string;
  position?: LeafPosition;
  isLocked?: boolean;
};

export function Leaf({
  leaf,
  rotation,
  onLeafRotate,
  onLeafRemove,
  onLeafGrab,
  className,
  position,
  isLocked,
}: LeafProps) {
  const grabbable = Boolean(onLeafGrab);
  const removable = Boolean(onLeafRemove);
  const rotatable = Boolean(onLeafRotate);
  const isStatic = !removable && !rotatable;

  return (
    <div
      key={`leaf-key-${leaf.id}`}
      className={clsx('y-leaf', grabbable && `y-leaf--grabbable`, getAnimationClass('fadeIn'), className)}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {leaf.cards.map((card: TextCard, cIndex: number) =>
        !isLocked && grabbable ? (
          <div
            role="button"
            key={card.id}
            className={clsx('y-leaf__card', 'y-leaf__card-button', `y-leaf__card--${cIndex}`)}
            onClick={() => onLeafGrab!(leaf.id)}
          >
            <div className="y-leaf__card-text">{card.text}</div>
          </div>
        ) : (
          <div key={card.id} className={clsx('y-leaf__card', `y-leaf__card--${cIndex}`)}>
            <div className="y-leaf__card-text">{card.text}</div>
          </div>
        )
      )}
      <div className="y-leaf__controls" style={{ transform: `rotate(-${rotation}deg)` }}>
        {!isLocked && rotatable && (
          <Button
            onClick={(e) => onLeafRotate!(e, leaf.id)}
            className="y-leaf__center y-leaf__center--rotatable"
            shape="circle"
          >
            <RedoOutlined />
          </Button>
        )}
        {!isLocked && removable && (
          <Button
            onClick={() => onLeafRemove!(position)}
            className="y-leaf__center y-leaf__center--rotatable"
            shape="circle"
          >
            <DeleteOutlined />
          </Button>
        )}

        {isLocked && (
          <div className="y-leaf__center">
            <IconAvatar icon={<LockIcon />} />
          </div>
        )}

        {isStatic && (
          <div className="y-leaf__center">
            <IconAvatar icon={<CloverIcon />} />
          </div>
        )}
      </div>
    </div>
  );
}
