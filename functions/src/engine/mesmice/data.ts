// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ObjectFeatureCardData } from '../../types/tdr';
import type { MesmiceOptions, ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import utils from '../../utils';
import { FEATURES_COUNTS, GAME_COMPLEXITY, GAME_DIFFICULTY, ITEMS_PER_PLAYER } from './constants';
import { sampleSize } from 'lodash';

/**
 * Get object features and items
 * @param language - The language code for localized resources
 * @param options - Game options including NSFW, complex mode, and hard mode settings
 * @param playerCount - Number of players in the game
 * @returns Resource data containing object features and manufactured items
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
  const allObjectFeatures = await resourceUtils.fetchResource<Dictionary<ObjectFeatureCardData>>(
    TDR_RESOURCES.OBJECT_FEATURES,
  );

  const featuresByLevel: {
    1: ObjectFeatureCardData[];
    2: ObjectFeatureCardData[];
    3: ObjectFeatureCardData[];
    4: ObjectFeatureCardData[];
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
    const features: ObjectFeatureCardData[] = [];

    Object.keys(counts).forEach((level) => {
      const levelFeatures: ObjectFeatureCardData[] = sampleSize(featuresByLevel[level], counts[level]);
      features.push(...levelFeatures);
    });
    return features;
  }

  return {
    features: getObjectFeatures(),
    items: selectedItems.map((item) => ({ id: item.id, name: item.name })),
  };
};
