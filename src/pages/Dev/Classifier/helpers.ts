import type { AlienItem, AlienItemDict } from './types';

export const findLatestId = (data: AlienItemDict) => {
  const orderedNumberedIds = Object.keys(data)
    .map(Number)
    .sort((a, b) => a - b);

  if (orderedNumberedIds.length < 1) {
    return '1';
  }

  for (let i = 1; i < orderedNumberedIds.length; i++) {
    if (orderedNumberedIds[i] - orderedNumberedIds[i - 1] !== 1) {
      return orderedNumberedIds[i];
    }
  }
  return orderedNumberedIds[orderedNumberedIds.length - 1];
};

export function countNonZeroAttributes(item: AlienItem): number {
  let count = 0;
  for (const weight of Object.values(item.attributes)) {
    if (weight !== 0) {
      count++;
    }
  }
  return count;
}

export function validateItem(item: AlienItem) {
  const attributes = Object.values(item.attributes);
  const hasName = Boolean(item.name);
  const hasFive = attributes.includes(5);
  const hasNoZeroes = !attributes.includes(0);
  const hasPositive = attributes.some((v) => v > 1);

  return {
    hasName,
    hasFive,
    hasNoZeroes,
    hasPositive,
  };
}
