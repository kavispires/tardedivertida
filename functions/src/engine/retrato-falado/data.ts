// Constants
import { GLOBAL_USED_DOCUMENTS } from '../../utils/constants';
import { PLAYER_COUNTS } from './constants';
// Types
import { MonsterImage } from '../../types/tdr';
import type { MonsterSketch, ResourceData } from './types';
// Helpers
import utils from '../../utils';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import * as dataUtils from '../collections';

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
  const availableMonsters: Collection<MonsterImage> = utils.game.filterOutByIds(allMonsters, usedCards);

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
export const saveData = async (sketches: MonsterSketch[], language: Language): Promise<void> => {
  const usedIds: BooleanDictionary = {};
  const drawings = sketches.reduce((acc, entry) => {
    usedIds[entry.id] = true;
    const key = [entry.id, entry.playerId, Date.now()].join('::');
    acc[key] = {
      id: entry.id,
      playerId: entry.playerId,
      drawing: entry.sketch,
    };
    return acc;
  }, {});
  await dataUtils.updateDataCollectionRecursively('monsterDrawings', language, drawings);

  await globalUtils.updateGlobalFirebaseDoc(GLOBAL_USED_DOCUMENTS.MONSTERS, usedIds);
};
