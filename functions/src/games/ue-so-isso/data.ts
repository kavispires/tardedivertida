// Types
import type { PastSuggestion } from './types';
// Services
import { updateFirestoreCommunityDataForCards } from '../../services/community-data';
// Resources
import { getSingleWords, saveUsedSingleWords } from '../../mechanics/resources';
// Utils
import { buildBooleanDictionary } from '../../utils';
// Internal
import { findDuplicateSuggestions } from './helpers';

/**
 * Get word cards resource based on the game's language
 * @param language - The language code for localized resources
 * @returns Array of single word text cards
 */
export const getWords = async (language: Language) => {
  return await getSingleWords(language);
};

/**
 * Saves used cards and created data
 * @param pastSuggestions - Array of past suggestions with card IDs and player suggestions
 * @param language - The language code for the saved data
 */
export const saveData = async (pastSuggestions: PastSuggestion[], language: Language) => {
  // Save used cards
  const usedIds = buildBooleanDictionary(pastSuggestions);
  await saveUsedSingleWords(usedIds);

  // Save card clues data
  const toBeSaved = pastSuggestions.reduce((acc, entry) => {
    const result = findDuplicateSuggestions(entry);
    acc[entry.id] = result;
    return acc;
  }, {});
  await updateFirestoreCommunityDataForCards('cards', language, toBeSaved);
};
