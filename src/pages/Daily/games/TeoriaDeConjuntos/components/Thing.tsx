import clsx from 'clsx';
// Ant Design Resources
import { Flex, Typography } from 'antd';
// Components
import { ItemCard } from 'components/cards/ItemCard';

type ThingProps = {
  itemId: string;
  name: string;
  width?: number;
  className?: string;
  minimize?: boolean;
};

export function Thing({ itemId, name, width = 50, className, minimize }: ThingProps) {
  return (
    <Flex vertical align="center" className={clsx('thing', className)}>
      {!minimize && (
        <ItemCard
          id={itemId}
          width={Math.max(Math.min(width, 100), 35)}
          padding={0}
          className="thing__sprite"
        />
      )}
      <Typography.Text code key={itemId} className="thing__name">
        {name}
      </Typography.Text>
    </Flex>
  );
}
