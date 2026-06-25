import { sampleSize } from 'lodash';
// Types
import type { TextCardData } from '../../types/tdr';
import type { ColegasDeQuartoOptions, PastClues, ResourceData } from './types';
// Constants
import { TDR_RESOURCES } from '../../constants/resources';
import { TOTAL_ROUNDS, WORDS_IN_POOL } from './constants';
// Services
import { updateFirestoreCommunityDataForCards } from '../../services/community-data';
import { fetchResource } from '../../services/resource';
// Utils
import utils from '../../utils_LEGACY';

/**
 * Get words resource based on the game's language
 * @param language - The language code for localized resources
 * @param options - Game options including words source selection
 * @returns Resource data containing deck of word cards
 */
export const getWords = async (
  language: Language,
  options?: ColegasDeQuartoOptions,
): Promise<ResourceData> => {
  const quantityNeeded = WORDS_IN_POOL * TOTAL_ROUNDS;

  if (options?.wordsSource === 'properties') {
    const allCards = await fetchResource<Dictionary<TextCardData>>(TDR_RESOURCES.THINGS_QUALITIES, language);
    // Does not need type because it is just text
    return { deck: sampleSize(Object.values(allCards), quantityNeeded) };
  }

  const deck = await utils.tdr.getSingleWords(language, quantityNeeded);

  return { deck };
};

/**
 * Save used cards and player clues
 * @param language - The language code for the saved data
 * @param pastClues - Dictionary of card IDs to their associated clues
 */
export const saveData = async (language: Language, pastClues: PastClues) => {
  const usedIds = utils.helpers.buildBooleanDictionary(Object.keys(pastClues));
  await utils.tdr.saveUsedSingleWords(usedIds);

  // Save card clues data
  await updateFirestoreCommunityDataForCards('cards', language, pastClues);
};
