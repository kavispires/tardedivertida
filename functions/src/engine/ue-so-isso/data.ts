// Types
import type { PastSuggestion } from './types';
// Helpers
import * as dataUtils from '../collections';
import utils from '../../utils';
import { findDuplicateSuggestions } from './helpers';

/**
 * Get word cards resource based on the game's language
 * @param language - The language code for localized resources
 * @returns Array of single word text cards
 */
export const getWords = async (language: Language) => {
  return await utils.tdr.getSingleWords(language);
};

/**
 * Saves used cards and created data
 * @param pastSuggestions - Array of past suggestions with card IDs and player suggestions
 * @param language - The language code for the saved data
 */
export const saveData = async (pastSuggestions: PastSuggestion[], language: Language) => {
  // Save used cards
  const usedIds = utils.helpers.buildBooleanDictionary(pastSuggestions);
  await utils.tdr.saveUsedSingleWords(usedIds);

  // Save card clues data
  const toBeSaved = pastSuggestions.reduce((acc, entry) => {
    const result = findDuplicateSuggestions(entry);
    acc[entry.id] = result;
    return acc;
  }, {});
  await dataUtils.updateCardDataCollection('cards', language, toBeSaved);
};
