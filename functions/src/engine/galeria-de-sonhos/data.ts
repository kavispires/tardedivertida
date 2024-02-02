// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { TABLE_DECK_TOTAL } from './constants';
// Types
import { TextCard } from '../../types/tdr';
import type { ImageCardMatch, ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import * as dataUtils from '../collections';
import * as globalUtils from '../global';
import utils from '../../utils';

/**
 * Get words resource based on the game's language
 * @param language
 * @param allImageDecks
 * @returns
 */
export const getWords = async (language: Language, allImageDecks: boolean): Promise<ResourceData> => {
  const resourceName = `${TDR_RESOURCES.WORDS_THEME}-${language}`;
  // Get full deck
  const allWords: Collection<TextCard> = await resourceUtils.fetchResource(resourceName);

  const imageCardIds = await utils.imageCards.getImageCards(TABLE_DECK_TOTAL, allImageDecks);

  return {
    allWords,
    images: imageCardIds,
  };
};

export const saveData = async (language: Language, bestMatches: ImageCardMatch[]) => {
  const usedCardsIds: BooleanDictionary = {};
  const clues = bestMatches.reduce((acc, entry) => {
    usedCardsIds[entry.id] = true;
    if (acc[entry.id] === undefined) {
      acc[entry.id] = [];
    }
    acc[entry.id].push(entry.text);
    return acc;
  }, {});

  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.IMAGE_CARDS, usedCardsIds);

  await dataUtils.updateCardDataCollection('imageCards', language, clues);
};
