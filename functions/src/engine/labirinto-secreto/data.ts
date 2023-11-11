// Constants
import { TDR_RESOURCES } from '../../utils/constants';
import { CARDS_PER_PLAYER, FOREST_HEIGHT, FOREST_WIDTH } from './constants';
// Types
import type { ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import utils from '../../utils';

/**
 * Get cards resources based on the game's language
 * @param language
 * @param playerCount
 * @returns
 */
export const getData = async (language: Language, playerCount: number): Promise<ResourceData> => {
  // Get cards
  const resourceName = `${TDR_RESOURCES.WORDS_TREES}-${language}`;
  const allWords: Collection<TextCard> = await resourceUtils.fetchResource(resourceName);

  // Get Adjectives
  const adjectivesPerPlayer = playerCount * CARDS_PER_PLAYER + 1;
  const adjectives = await utils.tdr.getAdjectives(language, adjectivesPerPlayer);

  return {
    forestCards: utils.game.getRandomItems(Object.values(allWords), FOREST_HEIGHT * FOREST_WIDTH),
    allCards: adjectives,
  };
};

// TODO: Add to game over
export const saveData = async (
  usedAdjectives: BooleanDictionary
  // usedTreeCards: BooleanDictionary,
) => {
  await utils.tdr.saveUsedAdjectives(usedAdjectives);
};
