// Utils
import { getRandomItem } from 'utils/helpers';
// Internal
import type { ExtendedObjectFeatureCard, HistoryEntry, ObjectCardObj } from './types';

export const mockObjectIdSelection = (items: ObjectCardObj[]) => {
  return getRandomItem(items).id;
};

export const mockFeatureSelection = (
  features: ExtendedObjectFeatureCard[],
  history: HistoryEntry[],
  target: string,
) => {
  const usedFeatureIds = history.map((h) => h.featureId);
  const safe = features
    .filter((feature) => feature.id !== target && !usedFeatureIds.includes(feature.id))
    .map((feature) => feature.id);

  const sample = safe.length > 1 ? [safe[0], safe[1]] : [safe[0]];

  return getRandomItem([...sample, ...sample, ...sample, target]);
};
