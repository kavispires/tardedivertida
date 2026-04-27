import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Internal
import type { WarehouseSlot } from './types';

export const useGoodSize = () => {
  const cardWidth = useCardWidth(9, {
    minWidth: 48,
    maxWidth: 96,
    margin: 16,
  });

  return {
    goodSize: { width: cardWidth, height: cardWidth },
    goodWidth: cardWidth - 12,
    warehouseWidth: cardWidth * 7 + 16 * 6,
  };
};

export const useWarehouse = (warehouseGrid: Dictionary<WarehouseSlot>) => {
  return useMemo(() => orderBy(warehouseGrid, ['id']), [warehouseGrid]);
};
