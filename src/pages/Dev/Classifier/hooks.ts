import { useState } from 'react';
import { FIRST_ID, LAST_ID } from './constants';

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
        return LAST_ID;
      }

      const curNum = Number(cur);
      const result = target + curNum;

      if (result > 0 && result <= Number(LAST_ID) + 1) {
        console.log('result', result);
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
