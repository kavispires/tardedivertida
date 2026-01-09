import clsx from 'clsx';
// Ant Design Resources
import { Space } from 'antd';
// Internal
import type { Item } from '../utils/types';
import { ItemEntry } from './ItemEntry';

type PairProps = {
  index: number;
  firstItem?: Item;
  secondItem?: Item;
  // Usually pool[0]
  placeholder: Item;
  size?: 'small';
};

export function Pair({ index, firstItem, secondItem, placeholder, size }: PairProps) {
  return (
    <Space
      className={clsx('pairs-grid__pair', `pairs-grid__pair--${index}`)}
      orientation="vertical"
      key={`pair-${index}`}
    >
      <div className="pairs-grid__slot">
        {firstItem ? (
          <ItemEntry
            itemEntry={firstItem}
            size={size}
          />
        ) : (
          <ItemEntry
            itemEntry={placeholder}
            className="pairs-grid__empty-slot"
            size={size}
          />
        )}
      </div>
      <div className="pairs-grid__slot">
        {secondItem ? (
          <ItemEntry
            itemEntry={secondItem}
            size={size}
          />
        ) : (
          <ItemEntry
            itemEntry={placeholder}
            className="pairs-grid__empty-slot"
            size={size}
          />
        )}
      </div>
    </Space>
  );
}
