import { sample } from 'lodash';
// Internal
import type { WarehouseSlot } from './types';

export function mockPlacement(warehouse: WarehouseSlot[]) {
  const availableSlots = warehouse.filter((slot) => slot.available);
  return sample(availableSlots)?.id ?? availableSlots[0].id;
}
