// Types
import type { SpectrumCardData } from '../../types/tdr';
import type { PastCategories, ResourceData } from './types';
// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../constants/collections';
import { TDR_RESOURCES } from '../../constants/resources';
import { PLAYER_COUNTS } from './constants';
// Services
import {
  resetGlobalTrackerDocument,
  updateGlobalTrackerDocumentData,
  fetchGlobalTrackerDocumentData,
} from '../../services/global-tracker';
import { fetchResource } from '../../services/resource';
// Utils
import utils from '../../utils_LEGACY';

/**
 * Get question resource based on the game's language
 * @param language - The language code for localized resources
 * @returns Resource data containing spectrum category cards
 */
export const getCategories = async (language: string): Promise<ResourceData> => {
  // Get full deck
  const allCategories = await fetchResource<Dictionary<SpectrumCardData>>(TDR_RESOURCES.SPECTRUMS, language);
  // Get used deck
  const usedCategories = await fetchGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.OPPOSING_IDEAS, {});

  // Filter out used cards
  const availableCategories = utils.game.filterOutByIds(allCategories, usedCategories);

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableCategories).length < PLAYER_COUNTS.MAX * 2) {
    await resetGlobalTrackerDocument(GLOBAL_USED_DOCUMENTS.OPPOSING_IDEAS);
    return { allCategories };
  }

  return {
    allCategories: availableCategories,
  };
};

/**
 * Save used categories to the global document
 * @param pastCategories - Dictionary of category IDs to their associated clues
 */
export const saveData = async (pastCategories: PastCategories): Promise<void> => {
  // Save usedTestemunhaOcularCards to global
  const usedOndaTelepaticaCategories = utils.helpers.buildBooleanDictionary(pastCategories);
  await updateGlobalTrackerDocumentData(GLOBAL_USED_DOCUMENTS.OPPOSING_IDEAS, usedOndaTelepaticaCategories);
};
