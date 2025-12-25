import clsx from 'clsx';
// Ant Design Resources
import { Flex, Typography } from 'antd';
// Pages
import { DailyItem } from 'pages/Daily/components/DailyItem';
// Internal
import { countThing } from '../utils/helpers';

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
        <DailyItem
          itemId={itemId}
          width={Math.max(Math.min(width, 100), 35)}
          padding={0}
          className="thing__sprite"
          title={countThing(name)}
        />
      )}
      <Typography.Text code key={itemId} className="thing__name">
        {name}
      </Typography.Text>
    </Flex>
  );
}
