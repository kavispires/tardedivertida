import { orderBy } from 'lodash';
// Types
import type { TextCardData } from '../../types/tdr';
import type { ResourceData } from './types';
// Constants
import { TDR_RESOURCES } from '../../utils/constants';
import { TOTAL_WORDS_NEEDED } from './constants';
// Utils
import utils from '../../utils';
// Internal
import * as resourceUtils from '../resource';

/**
 * Get word cards and categories resource based on the game's language
 * @param language - The language code for localized resources
 * @returns Resource data containing categories and single words
 */
export const getData = async (language: Language): Promise<ResourceData> => {
  const words = await utils.tdr.getSingleWords(language, TOTAL_WORDS_NEEDED);

  const categoriesResourceName = `${TDR_RESOURCES.CATEGORIES}-${language}`;
  const categories = await resourceUtils.fetchResource<Dictionary<TextCardData>>(categoriesResourceName);

  return {
    categories: orderBy(Object.values(categories), ['text'], ['asc']),
    words,
  };
};
