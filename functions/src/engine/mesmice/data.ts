// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { MesmiceOptions, ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import utils from '../../utils';
import {
  DOUBLE_ROUNDS_THRESHOLD,
  FEATURES_COUNTS,
  GAME_COMPLEXITY,
  GAME_DIFFICULTY,
  ITEMS_PER_PLAYER,
} from './constants';
import { alienItemUtils } from '../../utils/tdr-utils';

/**
 * Get object features and items
 * @param language
 * @returns
 */
export const getData = async (
  language: string,
  options: MesmiceOptions,
  playerCount: number
): Promise<ResourceData> => {
  const allowNSFW = !!options.nsfw;
  const complexity = options.complexMode ? GAME_COMPLEXITY.MORE : GAME_COMPLEXITY.NORMAL;
  const difficulty = options.hardMode ? GAME_DIFFICULTY.HARD : GAME_DIFFICULTY.EASY;
  const counts = FEATURES_COUNTS[complexity][difficulty];

  const shouldBuildTwoDecks = playerCount <= DOUBLE_ROUNDS_THRESHOLD;

  // Get items per player
  const selectedItems = await utils.tdr.getAlienItems(
    playerCount * ITEMS_PER_PLAYER * (shouldBuildTwoDecks ? 2 : 1),
    {
      allowNSFW,
      categories: ['mesmice'],
      filters: [alienItemUtils.onlyWithName(language as Language)],
    }
  );

  // Get full deck of features
  const allObjectFeatures: Collection<ObjectFeatureCard> = await resourceUtils.fetchResource(
    TDR_RESOURCES.OBJECT_FEATURES
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
    }
  );

  function getObjectFeatures() {
    const features: ObjectFeatureCard[] = [];

    Object.keys(counts).forEach((level) => {
      const levelFeatures = utils.game.getRandomItems<ObjectFeatureCard>(
        featuresByLevel[level],
        counts[level]
      );
      features.push(...levelFeatures);
    });
    return features;
  }

  const [items1, items2 = []] = utils.game.sliceInParts(selectedItems, shouldBuildTwoDecks ? 2 : 1);

  return {
    features: {
      1: getObjectFeatures(),
      2: shouldBuildTwoDecks ? getObjectFeatures() : [],
    },
    items: {
      1: items1.map((item) => ({ id: item.id, name: item.name })),
      2: items2.map((item) => ({ id: item.id, name: item.name })),
    },
  };
};
