// Types
import { TDR_RESOURCES } from '../../utils/constants';
import type { ResourceData } from './types';
// Helpers
import utils from '../../utils';
import * as resourceUtils from '../resource';
import { TOTAL_WORDS_NEEDED } from './constants';

/**
 * Get word cards and categories resource based on the game's language
 * @param language
 * @returns
 */
export const getData = async (language: Language): Promise<ResourceData> => {
  const words = await utils.tdr.getSingleWords(language, TOTAL_WORDS_NEEDED);

  const categoriesResourceName = `${TDR_RESOURCES.CATEGORIES}-${language}`;
  const categories = await resourceUtils.fetchResource(categoriesResourceName);

  return {
    categories: utils.helpers.orderBy(Object.values(categories), ['text'], ['asc']),
    words,
  };
};
