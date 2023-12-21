import { useState } from 'react';
import type { AlienItemDict } from './types';
import { FIRST_ID } from './constants';
import { UseMutateFunction } from 'react-query';

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
        return initialItem;
      }

      const curNum = Number(cur);
      const result = target + curNum;
      if (result > 0 && result <= Number(initialItem) + 1) {
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

export type UseAlienItemDocumentReturnValue = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isSaving: boolean;
  data: AlienItemDict;
  save: UseMutateFunction<AlienItemDict, unknown, AlienItemDict, unknown>;
  isDirty: boolean;
  reload: () => void;
  itemUtils: {
    latestId: string;
    create: (itemId: string) => void;
    updateNameEN: (itemId: string, name: string) => void;
    updateNamePT: (itemId: string, name: string) => void;
    updateAttributeValue: (itemId: string, attributeId: string, value: number) => void;
    updateNSFW: (itemId: string, value: boolean) => void;
  };
};
