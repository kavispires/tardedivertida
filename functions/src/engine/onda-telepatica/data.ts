// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
// Types
import { PastCategories, ResourceData } from './types';
import { OndaTelepaticaCard } from '../../utils/tdr';
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
  const resourceName = `onda-telepatica-${language}`;
  // Get full deck
  const allCategories = await resourceUtils.fetchResource(resourceName);
  // Get used deck
  const usedCategories = await globalUtils.getGlobalFirebaseDocData(
    GLOBAL_USED_DOCUMENTS.ONDA_TELEPATICA,
    {}
  );

  // Filter out used cards
  const availableCategories: Record<string, OndaTelepaticaCard> = utils.game.filterOutByIds(
    allCategories,
    usedCategories
  );

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableCategories).length < 20) {
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
export const saveUsedCategories = async (pastCategories: PastCategories) => {
  // Save usedTestemunhaOcularCards to global
  const usedOndaTelepaticaCategories = utils.helpers.buildIdDictionary(pastCategories);
  await globalUtils.updateGlobalFirebaseDoc(
    GLOBAL_USED_DOCUMENTS.ONDA_TELEPATICA,
    usedOndaTelepaticaCategories
  );
};
