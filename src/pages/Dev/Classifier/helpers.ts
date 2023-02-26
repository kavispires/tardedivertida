import { mean } from 'lodash';
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

export const getStats = (data: AlienItemDict) => {
  const attributeCounts: Record<string, Record<string, number>> = {};
  const positiveAttributes: number[] = [];
  const negativeAttributes: number[] = [];
  let positiveFives = 0;
  let negativeFives = 0;

  Object.values(data).forEach((item, index) => {
    positiveAttributes[index] = 0;
    negativeAttributes[index] = 0;
    let has5 = false;
    let hasMinus5 = false;
    Object.entries(item.attributes).forEach(([attribute, weight]) => {
      // Count attributes
      if (attributeCounts[attribute] === undefined) {
        attributeCounts[attribute] = {
          '-5': 0,
          '-3': 0,
          '-1': 0,
          '0': 0,
          '1': 0,
          3: 0,
          5: 0,
        };
      }
      attributeCounts[attribute][String(weight)] += 1;

      // Count weights
      if (weight > 0) {
        positiveAttributes[index] += weight;
      } else {
        negativeAttributes[index] += weight;
      }

      if (weight === 5 && !has5) {
        positiveFives += 1;
        has5 = true;
      }

      if (weight === -1 && !hasMinus5) {
        negativeFives += 1;
        hasMinus5 = true;
      }
    });
  });

  console.log({ positiveAttributes });

  const totalItems = Object.keys(data).length;

  return {
    attributeCounts,
    positiveFives: Math.round((positiveFives * 100) / totalItems),
    negativeFives: Math.round((negativeFives * 100) / totalItems),
    positiveAttributesMean: mean(positiveAttributes),
    negativeAttributesMean: mean(negativeAttributes),
    total: totalItems,
  };
};
