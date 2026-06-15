import { sample } from 'lodash';
// Internal
import type { SubmitFulfillmentPayload, WarehouseSlot } from './types';

export function mockPlacement(warehouse: WarehouseSlot[]) {
  const availableSlots = warehouse.filter((slot) => slot.available);
  return sample(availableSlots)?.id ?? availableSlots[0].id;
}

export function mockFulfillment(
  orders: string[],
  warehouse: WarehouseSlot[],
  round: number,
): SubmitFulfillmentPayload['fulfillments'] {
  // Progressive difficulty: Round 1 (40% correct), Round 2 (60% correct), Round 3 (80% correct, 100% attempt)
  const correctRate = round === 1 ? 0.4 : round === 2 ? 0.6 : 0.8;
  const attemptRate = round === 3 ? 1.0 : 0.7; // Round 3: all orders must be attempted

  const slotDict = warehouse.reduce(
    (dict, slot) => {
      if (slot.goodId) {
        dict[slot.goodId] = slot.id;
      }
      return dict;
    },
    {} as Record<string, number>,
  );

  const outOfStockOrders = orders.filter((order) => !slotDict[order]);
  const fulfilledOrders = orders.filter((order) => slotDict[order]);

  const fulfilled: Record<string, number> = {};
  const outOfStock: Record<string, number> = {};

  // Process orders that ARE in warehouse
  fulfilledOrders.forEach((goodId) => {
    const shouldAttempt = Math.random() < attemptRate;
    if (!shouldAttempt) return; // Skip this order

    const shouldBeCorrect = Math.random() < correctRate;
    if (shouldBeCorrect) {
      // Correctly fulfill
      fulfilled[goodId] = slotDict[goodId];
    } else {
      // Make an error: mark as out of stock (wrong)
      if (Math.random() < 0.5) {
        outOfStock[goodId] = -1;
      }
      // else: leave unfulfilled (skip)
    }
  });

  // Process orders that are NOT in warehouse (out of stock)
  outOfStockOrders.forEach((goodId) => {
    const shouldAttempt = Math.random() < attemptRate;
    if (!shouldAttempt) return; // Skip this order

    const shouldBeCorrect = Math.random() < correctRate;
    if (shouldBeCorrect) {
      // Correctly mark as out of stock
      outOfStock[goodId] = -1;
    } else {
      // Make an error: try to fulfill with wrong slot
      const unusedSlots = Object.keys(slotDict).filter((id) => !fulfilled[id]);
      if (unusedSlots.length > 0 && Math.random() < 0.7) {
        const randomGoodId = sample(unusedSlots);
        if (randomGoodId) {
          fulfilled[goodId] = slotDict[randomGoodId];
        }
      }
      // else: leave unfulfilled (skip)
    }
  });

  // Round 3: Ensure ALL orders are fulfilled (even if wrong)
  if (round === 3) {
    const unfulfilledOrders = orders.filter((order) => !fulfilled[order] && outOfStock[order] === undefined);
    const unusedSlots = Object.keys(slotDict).filter(
      (id) => !Object.values(fulfilled).includes(slotDict[id]),
    );

    unfulfilledOrders.forEach((order) => {
      if (slotDict[order]) {
        // It's in warehouse - fulfill it (could be right or wrong slot)
        if (Math.random() < correctRate) {
          fulfilled[order] = slotDict[order]; // Correct
        } else if (unusedSlots.length > 0) {
          const randomGoodId = unusedSlots.pop();
          if (randomGoodId) {
            fulfilled[order] = slotDict[randomGoodId]; // Wrong slot
          }
        } else {
          fulfilled[order] = slotDict[order]; // Fallback to correct
        }
      } else {
        // It's out of stock
        if (Math.random() < correctRate) {
          outOfStock[order] = -1; // Correct
        } else if (unusedSlots.length > 0) {
          const randomGoodId = unusedSlots.pop();
          if (randomGoodId) {
            fulfilled[order] = slotDict[randomGoodId]; // Wrong - trying to fulfill out of stock item
          } else {
            outOfStock[order] = -1; // Fallback to correct
          }
        } else {
          outOfStock[order] = -1; // Fallback to correct
        }
      }
    });
  }

  return {
    ...fulfilled,
    ...outOfStock,
  };
}
