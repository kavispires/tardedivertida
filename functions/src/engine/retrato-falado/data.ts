// Constants
import { GLOBAL_USED_DOCUMENTS, TDR_RESOURCES } from '../../utils/constants';
import { PLAYER_COUNTS } from './constants';
// Types
import type { MonsterImageData } from '../../types/tdr';
import type { MonsterSketch, ResourceData } from './types';
// Helpers
import utils from '../../utils';
import * as globalUtils from '../global';
import * as resourceUtils from '../resource';
import * as dataUtils from '../collections';

/**
 * Get monster cards ids
 * @returns Resource data containing available monster images
 */
export const getMonsterCards = async (): Promise<ResourceData> => {
  // Get images info
  const allMonsters = await resourceUtils.fetchResource<Dictionary<MonsterImageData>>(
    TDR_RESOURCES.MONSTER_ORIENTATION,
  );
  // Get used deck
  const usedCards = await globalUtils.getGlobalFirebaseDocData(GLOBAL_USED_DOCUMENTS.MONSTERS, {});

  // Filter out used cards
  const availableMonsters = utils.game.filterOutByIds(allMonsters, usedCards);

  // If not the minimum cards needed, reset and use all
  if (Object.keys(availableMonsters).length < PLAYER_COUNTS.MAX) {
    await utils.firestore.resetGlobalUsedDocument(GLOBAL_USED_DOCUMENTS.MONSTERS);
    return { allMonsters };
  }

  return {
    allMonsters: availableMonsters,
  };
};

/**
 * Save used cards to the global document
 * @param sketches - Array of monster sketches with player drawings
 * @param language - The language code for the saved data
 */
export const saveData = async (sketches: MonsterSketch[], language: Language): Promise<void> => {
  const usedIds: Dictionary<boolean> = {};
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
