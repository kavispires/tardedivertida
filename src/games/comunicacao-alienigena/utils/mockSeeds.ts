// Utils
import { SEPARATOR } from 'utils/constants';
// Components
import { alienAttributesUtils } from 'components/toolKits/AlienAttributes/alien-attributes';
// Internal
import type { Seed, SubmitSeedingPayload } from './types';

export function mockSeeds(seeds: Dictionary<Seed> = {}): SubmitSeedingPayload {
  const result = Object.values(seeds).reduce((acc: Dictionary<number>, seed) => {
    seed.items.forEach((item) => {
      const key = `${item.id}${SEPARATOR}${seed.attribute.id}`;
      acc[key] =
        Math.random() > 0.3
          ? alienAttributesUtils.ATTRIBUTE_VALUE_DICT.RELATED.value
          : alienAttributesUtils.ATTRIBUTE_VALUE_DICT.UNRELATED.value;
    });
    return acc;
  }, {});

  return { seeds: result };
}
