import { motion } from 'framer-motion';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAnimation } from 'utils/animations';
// Components
import { ItemCard } from 'components/cards/ItemCard';

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
        <ItemCard id={items[0]} width={itemWidth} />
      </motion.div>
      <span />
      <span />
      {items.slice(1).map((itemId, index) => (
        <motion.div key={itemId} {...getAnimation('fadeIn', { delay: index * 0.25 })}>
          <ItemCard id={itemId} width={itemWidth} />
        </motion.div>
      ))}
    </motion.div>
  );
}
