// Types
import { PastSuggestion } from './types';
// Helpers
import * as dataUtils from '../collections';
import utils from '../../utils';
import { findDuplicateSuggestions } from './helpers';

/**
 * Get word cards resource based on the game's language
 * @param language
 * @returns
 */
export const getWords = async (language: Language) => {
  return await utils.tdr.getSingleWords(language);
};

/**
 * Saves used cards and created data
 * @param pastSuggestions
 * @param language
 */
export const saveData = async (pastSuggestions: PastSuggestion[], language: Language) => {
  // Save used cards
  const usedIds = utils.helpers.buildIdDictionary(pastSuggestions);
  await utils.tdr.saveUsedSingleWords(usedIds);

  // Save card clues data
  const toBeSaved = pastSuggestions.reduce((acc, entry) => {
    const result = findDuplicateSuggestions(entry);
    acc[entry.id] = result;
    return acc;
  }, {});
  await dataUtils.updateCardDataCollection('cards', language, toBeSaved);
};
