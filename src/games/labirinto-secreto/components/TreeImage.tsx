import { Tooltip } from 'antd';
import clsx from 'clsx';
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
      <div className={clsx('tree-card', className)} style={{ width: `${width}px` }}>
        <Sprite source={source} id={itemId} width={width} title={text} />
        <Tooltip title={text}>
          <div className="tree-card__text">{text}</div>
        </Tooltip>
      </div>
    );
  }

  return <TreeCard id={String(id)} text={text} width={width} className={className} />;
}
