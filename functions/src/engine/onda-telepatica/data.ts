// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { PLAYER_COUNTS } from './constants';
// Types
import type { SpectrumCard } from '../../types/tdr';
import type { PastCategories, ResourceData } from './types';
// Utils
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import * as dataUtils from '../collections';
import utils from '../../utils';

/**
 * Get question resource based on the game's language
 * @param language
 * @returns
 */
export const getCategories = async (language: string): Promise<ResourceData> => {
  const resourceName = `${TDR_RESOURCES.SPECTRUMS}-${language}`;
  // Get full deck
  const allCategories: Collection<SpectrumCard> = await resourceUtils.fetchResource(resourceName);
  // Get used deck
  const usedCategories = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.OPPOSING_IDEAS, {});

  // Filter out used cards
  const availableCategories: Record<string, SpectrumCard> = utils.game.filterOutByIds(
    allCategories,
    usedCategories,
  );

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableCategories).length < PLAYER_COUNTS.MAX * 2) {
    await utils.firestore.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.OPPOSING_IDEAS);
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
export const saveData = async (pastCategories: PastCategories): Promise<void> => {
  await dataUtils.updateOpposingIdeasClues(pastCategories);

  // Save usedTestemunhaOcularCards to global
  const usedOndaTelepaticaCategories = utils.helpers.buildBooleanDictionary(pastCategories);
  await globalUtils.updateGlobalFirebaseDoc(
    GLOBAL_USED_DOCUMENTS.OPPOSING_IDEAS,
    usedOndaTelepaticaCategories,
  );
};
