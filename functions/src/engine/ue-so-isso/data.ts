// Types
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
// Helpers
import * as resourceUtils from '../resource';
import * as globalUtils from '../global';
import * as dataUtils from '../collections';
import utils from '../../utils';
import { PastSuggestion } from './types';
import { findDuplicateSuggestions } from './helpers';

/**
 * Get word cards resource based on the game's language
 * @param language
 * @returns
 */
export const getWords = async (language: string) => {
  const resourceName = `${TDR_RESOURCES.SINGLE_WORDS}-${language}`;
  return await resourceUtils.fetchResource(resourceName);
};

/**
 * Saves used cards and created data
 * @param language
 * @param pastSuggestions
 */
export const saveData = async (pastSuggestions: PastSuggestion[], language: Language) => {
  // Save used cards
  const usedIds = utils.helpers.buildIdDictionary(pastSuggestions);
  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.SINGLE_WORDS, usedIds);

  // Save card clues data
  const toBeSaved = pastSuggestions.reduce((acc, entry) => {
    const result = findDuplicateSuggestions(entry);

    acc[entry.id] = result;
    return acc;
  }, {});
  await dataUtils.updateCardDataCollection('cards', language, toBeSaved);
};
