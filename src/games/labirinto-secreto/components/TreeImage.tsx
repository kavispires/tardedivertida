import clsx from 'clsx';
// Ant Design Resources
import { Tooltip } from 'antd';
// Components
import { getSource } from 'components/cards/ItemCard';
import { TreeCard } from 'components/cards/TreeCard';
import { Sprite } from 'components/sprites';

type TreeImageProps = {
  id: string | number;
  text: string;
  width?: number;
  className?: string;
};

export function TreeImage({ id, text, width = 100, className }: TreeImageProps) {
  if (typeof id === 'string') {
    const [source, itemId] = getSource(id);

    return (
      <div
        className={clsx('tree-card', className)}
        style={{ width: `${width}px` }}
      >
        <Sprite
          source={source}
          spriteId={itemId}
          width={width}
          title={text}
        />
        <Tooltip title={text}>
          <div className="tree-card__text">{text}</div>
        </Tooltip>
      </div>
    );
  }

  return (
    <TreeCard
      treeId={id}
      text={text}
      width={width}
      className={className}
    />
  );
}
