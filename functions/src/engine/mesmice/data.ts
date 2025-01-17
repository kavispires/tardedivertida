// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ObjectFeatureCard } from '../../types/tdr';
import type { MesmiceOptions, ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import utils from '../../utils';
import { FEATURES_COUNTS, GAME_COMPLEXITY, GAME_DIFFICULTY, ITEMS_PER_PLAYER } from './constants';

/**
 * Get object features and items
 * @param language
 * @returns
 */
export const getData = async (
  language: string,
  options: MesmiceOptions,
  playerCount: number,
): Promise<ResourceData> => {
  const allowNSFW = !!options.nsfw;
  const complexity = options.complexMode ? GAME_COMPLEXITY.MORE : GAME_COMPLEXITY.NORMAL;
  const difficulty = options.hardMode ? GAME_DIFFICULTY.HARD : GAME_DIFFICULTY.EASY;
  const counts = FEATURES_COUNTS[complexity][difficulty];

  // Get items per player
  const selectedItems = await utils.tdr.getItems(playerCount * ITEMS_PER_PLAYER, {
    allowNSFW,
    decks: ['manufactured'],
    filters: [utils.tdr.itemUtils.onlyWithName(language as Language)],
    cleanUp: utils.tdr.itemUtils.cleanupDecks,
  });

  // Get full deck of features
  const allObjectFeatures = await resourceUtils.fetchResource<Dictionary<ObjectFeatureCard>>(
    TDR_RESOURCES.OBJECT_FEATURES,
  );

  const featuresByLevel: {
    1: ObjectFeatureCard[];
    2: ObjectFeatureCard[];
    3: ObjectFeatureCard[];
    4: ObjectFeatureCard[];
  } = Object.values(allObjectFeatures).reduce(
    (acc, feature) => {
      acc[feature.level].push(feature);
      return acc;
    },
    {
      1: [],
      2: [],
      3: [],
      4: [],
    },
  );

  function getObjectFeatures() {
    const features: ObjectFeatureCard[] = [];

    Object.keys(counts).forEach((level) => {
      const levelFeatures = utils.game.getRandomItems<ObjectFeatureCard>(
        featuresByLevel[level],
        counts[level],
      );
      features.push(...levelFeatures);
    });
    return features;
  }

  return {
    features: getObjectFeatures(),
    items: selectedItems.map((item) => ({ id: item.id, name: item.name })),
  };
};
