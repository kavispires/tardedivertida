// Types
import { TDR_RESOURCES } from '../../utils/constants';
import { ResourceData } from './types';
// Helpers
import * as utils from '../../utils';
import * as resourceUtils from '../resource';

/**
 * Get word cards and categories resource based on the game's language
 * @param language
 * @returns
 */
export const getData = async (language: string): Promise<ResourceData> => {
  const wordsResourceName = `${TDR_RESOURCES.SINGLE_WORDS}-${language}`;
  const words = await resourceUtils.fetchResource(wordsResourceName);
  const categoriesResourceName = `${TDR_RESOURCES.CATEGORIES}-${language}`;
  const categories = await resourceUtils.fetchResource(categoriesResourceName);

  return {
    categories: utils.helpers.orderBy(Object.values(categories), ['text'], ['asc']),
    words: utils.game.getRandomItems(Object.values(words), 5),
  };
};
