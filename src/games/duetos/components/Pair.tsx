import clsx from 'clsx';
// Ant Design Resources
import { Space } from 'antd';
// Components
import { ItemEntry } from './ItemEntry';

type PairProps = {
  index: number;
  firstItem?: ItemEntry;
  secondItem?: ItemEntry;
  // Usually pool[0]
  placeholder: ItemEntry;
  size?: 'small';
};

export function Pair({ index, firstItem, secondItem, placeholder, size }: PairProps) {
  return (
    <Space
      className={clsx('pairs-grid__pair', `pairs-grid__pair--${index}`)}
      direction="vertical"
      key={`pair-${index}`}
    >
      <div className="pairs-grid__slot">
        {Boolean(firstItem) ? (
          <ItemEntry itemEntry={firstItem!} size={size} />
        ) : (
          <ItemEntry itemEntry={placeholder} className="pairs-grid__empty-slot" size={size} />
        )}
      </div>
      <div className="pairs-grid__slot">
        {Boolean(secondItem) ? (
          <ItemEntry itemEntry={secondItem!} size={size} />
        ) : (
          <ItemEntry itemEntry={placeholder} className="pairs-grid__empty-slot" size={size} />
        )}
      </div>
    </Space>
  );
}