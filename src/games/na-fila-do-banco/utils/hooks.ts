import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Internal
import type { Teller } from './types';
import { TELLER_EFFECT_TYPE } from './constants';

/**
 * Calculates the card width for bank clients based on the longest queue length.
 */
export function useBankClientCardWidth(tellers: Dictionary<Teller>) {
  const longestQueueLength = Math.max(...Object.values(tellers).map((teller) => teller.queue.length));
  return useCardWidth(Math.max(10, longestQueueLength), { maxWidth: 96, minWidth: 48 });
}

/**
 * Determines the duration for the next step based on the last teller event effect type.
 */
export function useNextStepDuration(tellersList: Teller[]) {
  return useMemo(() => {
    const effectType = tellersList.reduce((acc: string | null, teller) => {
      if (teller.lastEvent?.effectType) {
        return teller.lastEvent.effectType;
      }
      return acc;
    }, null);

    switch (effectType) {
      case TELLER_EFFECT_TYPE.STAY:
        return 6;
      default:
        return 10;
    }
  }, [tellersList]);
}

/**
 * Returns tellers ordered by their ID in ascending order.
 */
export function useOrderedTellers(tellers: Dictionary<Teller>) {
  return useMemo(() => {
    return orderBy(Object.values(tellers), ['id'], ['asc']);
  }, [tellers]);
}
