// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
import { PLAYER_COUNTS } from './constants';
// Types
import type { MonsterSketch, ResourceData } from './types';
// Helpers
import utils from '../../utils';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';

/**
 * Get monster cards ids
 * @returns
 */
export const getMonsterCards = async (): Promise<ResourceData> => {
  // Get images info
  const allMonsters = await resourceUtils.fetchTDIData('md/cards');
  // Get used deck
  const usedCards = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.MONSTERS, {});

  // Filter out used cards
  const availableMonsters: Record<string, MonsterCard> = utils.game.filterOutByIds(allMonsters, usedCards);

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableMonsters).length < PLAYER_COUNTS.MAX) {
    await utils.firebase.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.MONSTERS);
    return { allMonsters };
  }

  return {
    allMonsters: availableMonsters,
  };
};

/**
 * Save used cards to the global document
 * @param pastSketches
 */
export const saveUsedCards = async (pastSketches: MonsterSketch[]): Promise<void> => {
  const usedRetratoFaladoCards = utils.helpers.buildIdDictionary(pastSketches);

  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.MONSTERS, usedRetratoFaladoCards);
};
