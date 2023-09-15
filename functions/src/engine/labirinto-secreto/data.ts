// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { FOREST_HEIGHT, FOREST_WIDTH } from './constants';
// Types
import type { ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import * as dataUtils from '../collections';
import * as globalUtils from '../global';
import utils from '../../utils';

/**
 * Get cards resources based on the game's language
 * @param language
 * @param allImageDecks
 * @returns
 */
export const getData = async (language: Language): Promise<ResourceData> => {
  // Get cards
  const resourceName = `${TDR_RESOURCES.WORDS_TREES}-${language}`;
  const allWords = await resourceUtils.fetchResource(resourceName);

  // Get Adjectives
  const resourceName2 = `${TDR_RESOURCES.ADJECTIVES}-${language}`;
  const allAdjectives = await resourceUtils.fetchResource(resourceName2);

  return {
    forestCards: utils.game.getRandomItems(Object.values(allWords), FOREST_HEIGHT * FOREST_WIDTH),
    allCards: utils.game.shuffle(Object.values(allAdjectives)),
  };
};

// TODO
export const saveData = async (language: Language) => {
  const usedCardsIds: BooleanDictionary = {};
  // const clues = bestMatches.reduce((acc, entry) => {
  //   usedCardsIds[entry.id] = true;
  //   if (acc[entry.id] === undefined) {
  //     acc[entry.id] = [];
  //   }
  //   acc[entry.id].push(entry.text);
  //   return acc;
  // }, {});

  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.IMAGE_CARDS, usedCardsIds);

  await dataUtils.updateCardDataCollection('imageCards', language, {});
};
