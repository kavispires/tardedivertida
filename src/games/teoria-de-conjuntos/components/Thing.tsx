import clsx from 'clsx';
// Ant Design Resources
import { Flex, Typography } from 'antd';
// Components
import { ItemSprite } from '@components/cards/ItemCard';

type ThingProps = {
  itemId: string;
  name: string;
  width?: number;
  className?: string;
  minimize?: boolean;
};

export function Thing({ itemId, name, width = 48, className, minimize }: ThingProps) {
  return (
    <Flex
      vertical
      align="center"
      className={clsx('thing', className)}
    >
      {!minimize && (
        <ItemSprite
          itemId={itemId}
          width={width}
        />
      )}
      <Typography.Text
        code
        key={itemId}
        className="thing__name"
      >
        {name}
      </Typography.Text>
    </Flex>
  );
}
