import clsx from 'clsx';
import { DailyItem } from 'pages/Daily/components/DailyItem';
// Ant Design Resources
import { Badge, Flex } from 'antd';
// Internal
import type { useOrganikuEngine } from '../utils/useOrganikuEngine';

type CompletionTrackerProps = {
  itemsIds: string[];
  tracker: ReturnType<typeof useOrganikuEngine>['tracker'];
  itemWidth: number;
};

export function CompletionTracker({ itemsIds, tracker, itemWidth }: CompletionTrackerProps) {
  return (
    <Flex gap={12} align="center" justify="center" className="my-5">
      {itemsIds.map((itemId) => {
        const isCompleted = tracker.completedItems[itemId];
        const count = tracker.remainingCounts[itemId];

        return (
          <Badge
            count={isCompleted ? '✓' : count}
            key={itemId}
            style={{ backgroundColor: isCompleted ? 'gold' : '#519e8a' }}
            size="small"
          >
            <DailyItem
              itemId={itemId}
              width={itemWidth * 0.75}
              className={clsx('organiku-tracker-item', { 'organiku-tracker-item--completed': isCompleted })}
            />
          </Badge>
        );
      })}
    </Flex>
  );
}
