import clsx from 'clsx';
// Ant Design Resources
import { Space } from 'antd';
// Components
import { Pair } from './Pair';

type MadePairsProps = {
  pool: ItemEntry[];
  pairs: string[];
  size?: 'small';
};

export function MadePairs({ pool, pairs, size }: MadePairsProps) {
  const pairsCount = Math.floor(pool.length / 2);

  return (
    <Space className={clsx('pairs-grid', `pairs-grid--made-${pairsCount}`)} wrap>
      {Array.from({ length: pairsCount }).map((_, index) => {
        const firstItemIndex = index * 2;
        const firstItemId = pairs[firstItemIndex];
        const secondItemId = pairs[firstItemIndex + 1];
        const firstItem = pool.find((item) => item.id === firstItemId);
        const secondItem = pool.find((item) => item.id === secondItemId);

        return (
          <Pair
            key={`${firstItemId}${secondItemId}`}
            index={index}
            firstItem={firstItem}
            secondItem={secondItem}
            placeholder={pool[0]}
            size={size}
          />
        );
      })}
    </Space>
  );
}
