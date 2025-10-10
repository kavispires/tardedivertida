import { motion } from 'motion/react';
import { DailyItem } from 'pages/Daily/components/DailyItem';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAnimation } from 'utils/animations';

type PreloadItemsProps = {
  items: string[];
};

export function PreloadItems({ items }: PreloadItemsProps) {
  const itemWidth = useCardWidth(5, {
    minWidth: 36,
    maxWidth: 48,
  });
  return (
    <motion.div
      className="preload-items"
      {...getAnimation('tada', { delay: 0.25 * (items.length + 2), speed: 'fast' })}
    >
      <span />
      <span />
      <motion.div className="preload-items__first" {...getAnimation('fadeIn')}>
        <DailyItem itemId={items[0]} width={itemWidth} />
      </motion.div>
      <span />
      <span />
      {items.slice(1).map((itemId, index) => (
        <motion.div key={itemId} {...getAnimation('fadeIn', { delay: index * 0.25 })}>
          <DailyItem itemId={itemId} width={itemWidth} />
        </motion.div>
      ))}
    </motion.div>
  );
}
