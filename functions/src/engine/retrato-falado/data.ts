// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
// Types
import { MonsterSketch, RetratoFaladoAdditionalData } from './types';
// Helpers
import * as utils from '../../utils/helpers';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';

/**
 * Get monster cards ids
 * @returns
 */
export const getMonsterCards = async (): Promise<RetratoFaladoAdditionalData> => {
  // Get images info
  const allMonsters = await resourceUtils.fetchTDIData('md/cards');
  // Get used deck
  const usedCards = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.RETRATO_FALADO, {});

  return {
    allMonsters,
    usedCardsId: Object.keys(usedCards),
  };
};

/**
 * Save used cards to the global document
 * @param pastSketches
 */
export const saveUsedCards = async (pastSketches: MonsterSketch[]): Promise<void> => {
  // Save usedRetratoFaladoCards to global
  const usedRetratoFaladoCards = utils.buildIdDictionary(pastSketches);
  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.RETRATO_FALADO, usedRetratoFaladoCards);
};
