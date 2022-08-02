// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { PLAYER_COUNTS } from './constants';
// Types
import type { PastCategories, ResourceData } from './types';
// Utils
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import * as utils from '../../utils';

/**
 * Get question resource based on the game's language
 * @param language
 * @returns
 */
export const getCategories = async (language: string): Promise<ResourceData> => {
  const resourceName = `${TDR_RESOURCES.OPPOSING_IDEAS}-${language}`;
  // Get full deck
  const allCategories = await resourceUtils.fetchResource(resourceName);
  // Get used deck
  const usedCategories = await globalUtils.getGlobalFirebaseDocData(
    GLOBAL_USED_DOCUMENTS.ONDA_TELEPATICA,
    {}
  );

  // Filter out used cards
  const availableCategories: Record<string, OpposingIdeaCard> = utils.game.filterOutByIds(
    allCategories,
    usedCategories
  );

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableCategories).length < PLAYER_COUNTS.MAX * 2) {
    await utils.firebase.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.ONDA_TELEPATICA);
    return { allCategories };
  }

  return {
    allCategories: availableCategories,
  };
};

/**
 * Save used categories to the global document
 * @param pastCategories
 */
export const saveUsedCategories = async (pastCategories: PastCategories): Promise<void> => {
  // Save usedTestemunhaOcularCards to global
  const usedOndaTelepaticaCategories = utils.helpers.buildIdDictionary(pastCategories);
  await globalUtils.updateGlobalFirebaseDoc(
    GLOBAL_USED_DOCUMENTS.ONDA_TELEPATICA,
    usedOndaTelepaticaCategories
  );
};
