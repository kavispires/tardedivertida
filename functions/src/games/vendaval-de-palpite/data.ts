import { orderBy } from 'lodash';
// Types
import type { TextCardData } from '../../types/tdr';
import type { ResourceData } from './types';
// Constants
import { TDR_RESOURCES } from '../../constants/resources';
import { TOTAL_WORDS_NEEDED } from './constants';
// Services
import { fetchResource } from '../../services/resource';
// Utils
import utils from '../../utils';

/**
 * Get word cards and categories resource based on the game's language
 * @param language - The language code for localized resources
 * @returns Resource data containing categories and single words
 */
export const getData = async (language: Language): Promise<ResourceData> => {
  const words = await utils.tdr.getSingleWords(language, TOTAL_WORDS_NEEDED);

  const categoriesResourceName = `${TDR_RESOURCES.CATEGORIES}-${language}`;
  const categories = await fetchResource<Dictionary<TextCardData>>(categoriesResourceName);

  return {
    categories: orderBy(Object.values(categories), ['text'], ['asc']),
    words,
  };
};
