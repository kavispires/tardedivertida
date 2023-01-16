// Constants
import { TDR_RESOURCES } from '../../utils/constants';
// Types
import type { ResourceData } from './types';
// Utils
import * as resourceUtils from '../resource';
import utils from '../../utils';
import { TABLE_DECK_TOTAL } from './constants';

/**
 * Get words resource based on the game's language
 * @param language
 * @param originalDecksOnly
 * @returns
 */
export const getWords = async (language: string, originalDecksOnly: boolean): Promise<ResourceData> => {
  const resourceName = `${TDR_RESOURCES.WORDS_1}-${language}`;
  // Get full deck
  const allWords = await resourceUtils.fetchResource(resourceName);

  const imageCardIds = await utils.imageCards.getImageCards(TABLE_DECK_TOTAL, originalDecksOnly);

  return {
    allWords,
    images: imageCardIds,
  };
};
