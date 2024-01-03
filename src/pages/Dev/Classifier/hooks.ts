import { useState } from 'react';
import { FIRST_ID } from './constants';
import { TOTAL_ALIEN_ITEMS } from 'utils/constants';

export function useItem(initialItem = FIRST_ID) {
  const [itemId, setItemId] = useState(initialItem);

  const previousItem = () => {
    setItemId((cur) => {
      return String(Number(cur) - 1);
    });
  };

  const nextItem = () => {
    setItemId((cur) => {
      return String(Number(cur) + 1);
    });
  };

  const goTo = (target: number | 'first' | 'last') => {
    setItemId((cur) => {
      if (target === 'first') {
        return FIRST_ID;
      }

      if (target === 'last') {
        return TOTAL_ALIEN_ITEMS;
      }

      const curNum = Number(cur);
      const result = target + curNum;

      if (result > 0 && result <= Number(TOTAL_ALIEN_ITEMS) + 1) {
        return String(Number(cur) + target);
      }

      if (target < 0) {
        return FIRST_ID;
      }

      return initialItem;
    });
  };

  return {
    itemId,
    previousItem,
    nextItem,
    setItemId,
    itemNumber: Number(itemId),
    goTo,
  };
}
