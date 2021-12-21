// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
// Types
import { PastCategories, ResourceData } from './types';
// Utils
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
// Helpers
import { buildUsedCategoriesIdsDict } from './helpers';

/**
 * Get question resource based on the game's language
 * @param language
 * @returns
 */
export const getCategories = async (language: string): Promise<ResourceData> => {
  const resourceName = `onda-telepatica-${language}`;
  // Get full deck
  const allCategories = await resourceUtils.fetchResource(resourceName);
  // Get used deck
  const usedCategories = await globalUtils.getGlobalFirebaseDocData(
    GLOBAL_USED_DOCUMENTS.ONDA_TELEPATICA,
    {}
  );
  return {
    allCategories,
    usedCategories: Object.keys(usedCategories),
  };
};

/**
 * Save used categories to the global document
 * @param pastQuestions
 */
export const saveUsedCategories = async (pastCategories: PastCategories) => {
  // Save usedTestemunhaOcularCards to global
  const usedOndaTelepaticaCategories = buildUsedCategoriesIdsDict(pastCategories);
  await globalUtils.updateGlobalFirebaseDoc(
    GLOBAL_USED_DOCUMENTS.ONDA_TELEPATICA,
    usedOndaTelepaticaCategories
  );
};
