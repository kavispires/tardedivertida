import clsx from 'clsx';
import { orderBy } from 'lodash';
import { motion } from 'motion/react';
import { useMemo } from 'react';
// Types
import type { Item } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAnimation } from 'utils/animations';
import { stringRemoveAccents } from 'utils/helpers';
// Components
import { TransparentButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
// Internal
import { useSpriteWidth } from '../utils/useSpriteWidth';

type ItemsBoardProps = {
  items: Dictionary<Item>;
  selectedItems?: string[];
  onSelectItem: (itemId: string) => void;
  currentAge: number;
};

export function ItemsBoard({ items, selectedItems = [], onSelectItem, currentAge }: ItemsBoardProps) {
  const { dualTranslate, language } = useLanguage();
  const orderedItems = useMemo(
    () => orderBy(Object.values(items), [(o) => stringRemoveAccents(o.name[language])], ['asc']),
    [items, language],
  );
  const itemWidth = useSpriteWidth();

  const columnsCount = Math.min(12, Math.floor(orderedItems.length / 6));

  return (
    <div className="idade-items-board" style={{ gridTemplateColumns: `repeat(${columnsCount}, 1fr)` }}>
      {orderedItems.map((item, index) => {
        const newItem = item.decks?.includes(`age${currentAge}`);
        return (
          <TransparentButton key={item.id} onClick={() => onSelectItem(item.id)}>
            <motion.div
              {...getAnimation(newItem ? 'bounceIn' : 'flipInX', {
                delay: (newItem ? 1 : 0) + 0.1 * (Math.floor(index / columnsCount) + (index % columnsCount)),
              })}
            >
              <ItemCard
                key={item.id}
                itemId={item.id}
                title={dualTranslate(item.name)}
                width={itemWidth}
                className={clsx({
                  'idade-items-board__item--selected': selectedItems.includes(item.id),
                  'idade-items-board__item--current-age': currentAge > 1 && newItem,
                })}
              />
            </motion.div>
          </TransparentButton>
        );
      })}
    </div>
  );
}
