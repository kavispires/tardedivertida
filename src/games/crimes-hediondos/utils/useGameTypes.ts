import { useMemo } from 'react';
// Internal
import type { ItemsDict } from './types';

export function useGameTypes(items: ItemsDict) {
  return useMemo(() => {
    const isLocationGame = Object.values(items).some((item) => item.type === 'location');
    const isVictimGame = Object.values(items).some((item) => item.type === 'victim');
    return { isLocationGame, isVictimGame };
  }, [items]);
}
