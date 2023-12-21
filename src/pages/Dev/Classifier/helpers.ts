import { mean } from 'lodash';
import { ATTRIBUTES, FIRST_ID } from './constants';
import type { AlienItem, AlienItemDict, Attribute, Weight, FirebaseAlienItemDict } from './types';

export const findLatestId = (data: AlienItemDict) => {
  const orderedNumberedIds = Object.keys(data)
    .map(Number)
    .sort((a, b) => a - b);

  if (orderedNumberedIds.length < 1) {
    return FIRST_ID;
  }

  for (let i = 1; i < orderedNumberedIds.length; i++) {
    if (orderedNumberedIds[i] - orderedNumberedIds[i - 1] !== 1) {
      return orderedNumberedIds[i];
    }
  }
  return orderedNumberedIds[orderedNumberedIds.length - 1];
};

export const findFirstIncomplete = (data: AlienItemDict) => {
  const orderedNumberedIds = Object.keys(data)
    .map(Number)
    .sort((a, b) => a - b);

  for (let i = 0; i < orderedNumberedIds.length; i++) {
    const id = orderedNumberedIds[i];
    const item = data[id];
    if (Object.values(item.attributes).includes(0)) {
      return id;
    }
  }

  if (orderedNumberedIds.length < 1) {
    return FIRST_ID;
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

export function validateItem(item: AlienItem, allAttributes: Record<Attribute, Weight>) {
  const attributes = Object.values({ ...allAttributes, ...item.attributes });
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

export function replaceAttributes(newData: Record<string, Record<string, Record<string, number>>>) {
  Object.values(newData).forEach((item) => {
    item.attributes.hard = item.attributes.solid;
    delete item.attributes.solid;
  });
}

/**
 * Generates a new items with attributes in their initial states
 */
export const initialAttributeState = Object.keys(ATTRIBUTES).reduce((acc: any, key) => {
  acc[key] = 0;
  return acc;
}, {}) as Record<Attribute, Weight>;

/**
 * Checks if an item matches the criteria
 * @param item
 * @param attribute
 * @param criteria
 * @returns
 */
export function checkCriteria(item: AlienItem, attribute: Attribute, criteria: string) {
  if (criteria === '>0') {
    return item.attributes[attribute] > 0;
  }
  if (criteria === '>1') {
    return item.attributes[attribute] > 1;
  }

  if (criteria === '<0') {
    return item.attributes[attribute] < 0;
  }
  if (criteria === '<1') {
    return item.attributes[attribute] < 1;
  }

  if (criteria === '5') {
    return item.attributes[attribute] === 5;
  }

  if (criteria === '3') {
    return item.attributes[attribute] === 3;
  }

  if (criteria === '1') {
    return item.attributes[attribute] === 1;
  }

  if (criteria === '-1') {
    return item.attributes[attribute] === -1;
  }

  if (criteria === '-3') {
    return item.attributes[attribute] === -3;
  }

  if (criteria === '-5') {
    return item.attributes[attribute] === -5;
  }

  if (criteria === '0') {
    return item.attributes[attribute] === 0;
  }

  return true;
}

export function downloadObjectAsFile(obj: PlainObject, filename: string): void {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const anchorElement = document.createElement('a');
  anchorElement.href = window.URL.createObjectURL(blob);
  anchorElement.download = filename;
  anchorElement.click();
  window.URL.revokeObjectURL(anchorElement.href);
}

export const prepareFirebaseAlienItemDict = (data: AlienItemDict): FirebaseAlienItemDict => {
  const newData: FirebaseAlienItemDict = {};
  Object.values(data).forEach((item) => {
    newData[item.id] = {
      id: item.id,
      name: item.name,
      attributesStr: JSON.stringify(item.attributes),
    };
    if (item.nsfw) {
      newData[item.id].nsfw = true;
    }
    if (item.categories) {
      newData[item.id].categories = item.categories;
    }
  });
  return newData;
};

export const parseFirebaseAlienItemDict = (data: FirebaseAlienItemDict): AlienItemDict => {
  const newData: AlienItemDict = {};
  Object.values(data).forEach((item) => {
    newData[item.id] = {
      id: item.id,
      name: item.name,
      attributes: JSON.parse(item.attributesStr),
      nsfw: item.nsfw,
      categories: item.categories,
    };
  });
  return newData;
};
